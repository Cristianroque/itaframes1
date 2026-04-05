/**
 * Converte links partilháveis (YouTube, Vimeo) em URL adequada para <iframe src>.
 * O YouTube não aceita youtube.com/watch?v=... diretamente no iframe.
 */

function withHttps(raw: string): string {
  const t = raw.trim();
  if (!t) return t;
  if (t.startsWith("//")) return `https:${t}`;
  if (/^https?:\/\//i.test(t)) return t;
  return `https://${t}`;
}

function extractYouTubeVideoId(url: URL): string | null {
  const host = url.hostname.replace(/^www\./i, "").toLowerCase();

  if (host === "youtu.be") {
    const id = url.pathname.split("/").filter(Boolean)[0];
    return id || null;
  }

  if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
    const path = url.pathname;
    const embedMatch = path.match(/^\/embed\/([^/?]+)/);
    if (embedMatch) return embedMatch[1];
    const shortsMatch = path.match(/^\/shorts\/([^/?]+)/);
    if (shortsMatch) return shortsMatch[1];
    const liveMatch = path.match(/^\/live\/([^/?]+)/);
    if (liveMatch) return liveMatch[1];
    const v = url.searchParams.get("v");
    if (v) return v;
  }

  return null;
}

function extractVimeoId(url: URL): string | null {
  const host = url.hostname.replace(/^www\./i, "").toLowerCase();
  if (!host.includes("vimeo.com")) return null;
  const m = url.pathname.match(/\/(?:video\/)?(\d+)/);
  return m?.[1] ?? null;
}

/**
 * Devolve uma URL segura para usar em iframe, ou a string original se já for utilizável.
 */
export function resolveVideoEmbedSrc(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  try {
    const url = new URL(withHttps(trimmed));
    const yt = extractYouTubeVideoId(url);
    if (yt) {
      const q = new URLSearchParams(url.search);
      const t = q.get("t") ?? q.get("start");
      const base = `https://www.youtube.com/embed/${encodeURIComponent(yt)}`;
      if (t) {
        const seconds = parseYouTubeTimestamp(t);
        if (seconds != null) return `${base}?start=${seconds}&rel=0`;
      }
      return `${base}?rel=0`;
    }

    const vimeo = extractVimeoId(url);
    if (vimeo) {
      return `https://player.vimeo.com/video/${encodeURIComponent(vimeo)}`;
    }
  } catch {
    return trimmed;
  }

  return trimmed;
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
