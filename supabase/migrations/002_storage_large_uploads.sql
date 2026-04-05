-- Aumenta o limite de tamanho por ficheiro no bucket do CMS (imagens/vídeos grandes).
-- O plano Supabase pode impor ainda um teto global; confira Project Settings → Storage.
-- Execute no SQL Editor depois de 001_cms_schema.sql.

update storage.buckets
set
  file_size_limit = 53687091200, -- 50 GiB por objeto
  allowed_mime_types = null -- sem restrição de tipo MIME no bucket
where id = 'site-media';
