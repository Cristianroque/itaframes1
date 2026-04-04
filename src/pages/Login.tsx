import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";

function loginErrorMessage(): string {
  return "Erro ao fazer login";
}

function invalidCredentialsMessage(): string {
  return "Email ou senha inválidos";
}

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [alreadyIn, setAlreadyIn] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setCheckingSession(false);
      return;
    }

    void supabase.auth.getSession().then(({ data: { session } }) => {
      setAlreadyIn(!!session);
      setCheckingSession(false);
    });
  }, []);

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-body text-sm text-muted-foreground">
        A carregar…
      </div>
    );
  }

  if (alreadyIn) {
    return <Navigate to="/admin" replace />;
  }

  if (!isSupabaseConfigured || !supabase) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-sm p-8 w-full max-w-md text-center">
          <p className="font-body text-sm text-muted-foreground">
            Supabase não está configurado. Defina URL e chave anon no <code className="text-xs">.env</code>.
          </p>
          <Link to="/" className="inline-block mt-6 font-body text-sm text-primary hover:underline">
            Voltar ao site
          </Link>
        </div>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const { error: signErr } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signErr) {
        const msg = signErr.message?.toLowerCase() ?? "";
        const looksLikeBadCredentials =
          msg.includes("invalid login") || msg.includes("invalid credentials");
        setError(looksLikeBadCredentials ? invalidCredentialsMessage() : loginErrorMessage());
        return;
      }

      navigate("/admin", { replace: true });
    } catch {
      setError(loginErrorMessage());
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-sm p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-bold text-foreground">
            ITA <span className="text-primary">FRAMES</span>
          </h1>
          <p className="font-body text-sm text-muted-foreground mt-2">Entrar no painel</p>
        </div>

        <form onSubmit={(e) => void onSubmit(e)} className="space-y-4">
          {error ? (
            <p className="text-sm text-destructive font-body" role="alert">
              {error}
            </p>
          ) : null}
          <input
            type="email"
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none rounded-sm"
            required
          />
          <input
            type="password"
            autoComplete="current-password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none rounded-sm"
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-sm disabled:opacity-60"
          >
            <LogIn size={16} /> {submitting ? "A entrar…" : "Entrar"}
          </button>
        </form>

        <p className="mt-6 text-center">
          <Link to="/" className="font-body text-xs text-muted-foreground hover:text-foreground">
            Voltar ao site
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
