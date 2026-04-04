-- Ita Frames CMS — execute no SQL Editor do Supabase (uma vez por projeto).
-- Guia passo a passo: ../SETUP.md
-- Depois: Authentication → criar utilizador (email + senha) para login em /login (ver SETUP.md).

-- Tabelas
create table if not exists public.site_content (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  whatsapp text,
  email text,
  instagram text,
  youtube text,
  phone text,
  primary_color text,
  contact_headline text,
  contact_intro text,
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id) values (1)
on conflict (id) do nothing;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  category text not null,
  cover_image_url text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_media (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  type text not null check (type in ('image', 'video', 'video_embed')),
  url text not null,
  alt text,
  poster_url text,
  sort_order int not null default 0
);

create index if not exists idx_project_media_project on public.project_media (project_id);
create index if not exists idx_projects_published on public.projects (published, sort_order);

-- RLS
alter table public.site_content enable row level security;
alter table public.site_settings enable row level security;
alter table public.projects enable row level security;
alter table public.project_media enable row level security;

-- Leitura pública do conteúdo estático
create policy "site_content_select_public" on public.site_content for select using (true);
create policy "site_settings_select_public" on public.site_settings for select using (true);

-- Projetos publicados (site)
create policy "projects_select_published" on public.projects for select using (published = true);

create policy "project_media_select_published" on public.project_media for select using (
  exists (select 1 from public.projects p where p.id = project_id and p.published = true)
);

-- Escrita autenticada (usuários em Authentication com JWT)
create policy "site_content_all_auth" on public.site_content for all to authenticated using (true) with check (true);
create policy "site_settings_all_auth" on public.site_settings for all to authenticated using (true) with check (true);
create policy "projects_all_auth" on public.projects for all to authenticated using (true) with check (true);
create policy "project_media_all_auth" on public.project_media for all to authenticated using (true) with check (true);

-- Leitura completa de projetos para admin autenticado
create policy "projects_select_auth" on public.projects for select to authenticated using (true);
create policy "project_media_select_auth" on public.project_media for select to authenticated using (true);

-- Storage: bucket público para leitura, upload só autenticado
insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do nothing;

create policy "site_media_public_read" on storage.objects for select using (bucket_id = 'site-media');
create policy "site_media_auth_insert" on storage.objects for insert to authenticated with check (bucket_id = 'site-media');
create policy "site_media_auth_update" on storage.objects for update to authenticated using (bucket_id = 'site-media');
create policy "site_media_auth_delete" on storage.objects for delete to authenticated using (bucket_id = 'site-media');
