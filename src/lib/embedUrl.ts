/**
 * Converte links partilháveis (YouTube, Vimeo) em URL adequada para <iframe src>.
 * Páginas youtube.com/watch, /shorts, youtu.be, etc. enviam X-Frame-Options e não podem
 * ser usadas diretamente no iframe — só https://www.youtube.com/embed/VIDEO_ID
 */

function withHttps(raw: string): string {
  const t = raw.trim();
  if (!t) return t;
  if (t.startsWith("//")) return `https:${t}`;
  if (/^https?:\/\//i.test(t)) return t;
  return `https://${t}`;
}

/** IDs do YouTube costumam ter 11 caracteres; aceitamos um intervalo seguro. */
function isPlausibleYouTubeId(id: string): boolean {
  return /^[a-zA-Z0-9_-]{10,12}$/.test(id);
}

/**
 * Extrai o ID do vídeo a partir do texto completo (funciona com youtube.com, youtube.com.br, mobile, etc.).
 */
function extractYouTubeVideoIdFromString(input: string): string | null {
  const s = input.trim();

  const patterns: RegExp[] = [
    /[?&]v=([a-zA-Z0-9_-]{10,12})\b/,
    /youtu\.be\/([a-zA-Z0-9_-]{10,12})(?:[?&#/]|$)/i,
    /youtube\.(?:[a-z.]+\/)?embed\/([a-zA-Z0-9_-]{10,12})(?:[?&#/]|$)/i,
    /youtube\.(?:[a-z.]+\/)?shorts\/([a-zA-Z0-9_-]{10,12})(?:[?&#/]|$)/i,
    /youtube\.(?:[a-z.]+\/)?live\/([a-zA-Z0-9_-]{10,12})(?:[?&#/]|$)/i,
  ];

  for (const re of patterns) {
    const m = s.match(re);
    if (m?.[1] && isPlausibleYouTubeId(m[1])) return m[1];
  }

  try {
    const url = new URL(withHttps(s));
    const host = url.hostname.replace(/^www\./i, "").toLowerCase();

    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id && isPlausibleYouTubeId(id) ? id : null;
    }

    const isYt =
      host === "youtube.com" ||
      host.endsWith(".youtube.com") ||
      /^youtube\.com\./.test(host);

    if (isYt) {
      const path = url.pathname;
      for (const re of [
        /^\/embed\/([a-zA-Z0-9_-]{10,12})/,
        /^\/shorts\/([a-zA-Z0-9_-]{10,12})/,
        /^\/live\/([a-zA-Z0-9_-]{10,12})/,
      ]) {
        const m = path.match(re);
        if (m?.[1]) return m[1];
      }
      const v = url.searchParams.get("v");
      if (v && isPlausibleYouTubeId(v)) return v;
    }
  } catch {
    /* ignorar */
  }

  return null;
}

function extractVimeoIdFromString(input: string): string | null {
  const m = input.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m?.[1] ?? null;
}

function looksLikeYouTubeShareLink(s: string): boolean {
  return /youtube\.|youtu\.be/i.test(s);
}

/** Aceita "120", "2m30s", "1h2m3s" aproximado, ou número em segundos. */
function parseYouTubeTimestamp(t: string): number | null {
  const n = Number(t);
  if (!Number.isNaN(n) && n >= 0) return Math.floor(n);
  const h = t.match(/(\d+)h/);
  const m = t.match(/(\d+)m/);
  const s = t.match(/(\d+)s/);
  if (h || m || s) {
    const H = h ? parseInt(h[1], 10) * 3600 : 0;
    const M = m ? parseInt(m[1], 10) * 60 : 0;
    const S = s ? parseInt(s[1], 10) : 0;
    return H + M + S;
  }
  return null;
}

/**
 * Devolve URL para iframe, ou "" se não for possível incorporar com segurança.
 * Nunca devolve /watch ou /shorts (evita X-Frame-Options).
 */
export function resolveVideoEmbedSrc(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  const ytId = extractYouTubeVideoIdFromString(trimmed);
  if (ytId) {
    let start: number | null = null;
    try {
      const url = new URL(withHttps(trimmed));
      const t = url.searchParams.get("t") ?? url.searchParams.get("start");
      if (t) start = parseYouTubeTimestamp(t);
    } catch {
      /* sem query */
    }
    const base = `https://www.youtube.com/embed/${encodeURIComponent(ytId)}`;
    if (start != null) return `${base}?start=${start}&rel=0`;
    return `${base}?rel=0`;
  }

  const vimeoId = extractVimeoIdFromString(trimmed);
  if (vimeoId) {
    return `https://player.vimeo.com/video/${encodeURIComponent(vimeoId)}`;
  }

  try {
    const url = new URL(withHttps(trimmed));
    const host = url.hostname.toLowerCase();
    if (host.includes("player.vimeo.com")) return trimmed;

    const path = url.pathname;
    if (host.includes("youtube.com") && path.startsWith("/embed/")) {
      return trimmed.split("#")[0];
    }
  } catch {
    /* continuar */
  }

  if (looksLikeYouTubeShareLink(trimmed)) {
    return "";
  }

  return trimmed;
}
