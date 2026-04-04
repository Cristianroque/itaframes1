# Supabase — configurar o CMS e o `/admin`

Siga na ordem. Use um projeto em [supabase.com](https://supabase.com) (plano gratuito serve).

## 1. Variáveis no frontend

No arquivo `.env` na raiz (copie de `.env.example`):

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

- **URL** e **anon key**: *Project Settings → API*.
- Pode usar em alternativa `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` (este projeto aceita os dois prefixos).

**Nunca** coloque a chave **service_role** no frontend.

Reinicie o `npm run dev` após alterar o `.env`.

## 2. Banco de dados e RLS

1. No Supabase: **SQL Editor → New query**.
2. Cole o conteúdo completo de `migrations/001_cms_schema.sql`.
3. Execute **Run** uma vez.

Isso cria as tabelas `site_content`, `site_settings`, `projects`, `project_media`, as políticas RLS e o bucket de storage `site-media`.

## 3. Utilizador do painel (Auth)

1. Em **Authentication → Providers → Email**, desative **Confirm email** (recomendado para desenvolvimento), para o login com senha devolver sessão de imediato.
2. Em **Authentication → Users → Add user**, crie um utilizador com **email** e **senha** que vai usar em `http://localhost:8080/login`.

O login do painel é **só** via Supabase (`signInWithPassword`): email + senha em `/login`; `/admin` exige sessão ativa.

## 4. Storage

Após o SQL, confira em **Storage** se existe o bucket **`site-media`** (público para leitura).

## 5. Testar

1. `npm run dev` → `http://localhost:8080/login` (email e senha do passo 3).
2. Após entrar, aceda a `http://localhost:8080/admin`.
3. Crie um projeto ou guarde conteúdo; se der erro de permissão, confira RLS e se está autenticado (sessão no mesmo browser).

## Referência rápida

| Variável | Uso |
|----------|-----|
| `VITE_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto |
| `VITE_SUPABASE_ANON_KEY` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave pública (anon) |
