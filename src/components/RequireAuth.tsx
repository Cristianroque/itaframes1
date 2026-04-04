import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";

type GateState = "loading" | "ok" | "no-session" | "no-config";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GateState>("loading");

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setState("no-config");
      return;
    }

    let cancelled = false;

    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return;
      setState(session ? "ok" : "no-session");
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return;
      setState(session ? "ok" : "no-session");
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  if (state === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-body text-sm text-muted-foreground">
        A carregar…
      </div>
    );
  }

  if (state === "no-config") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <p className="font-body text-sm text-muted-foreground text-center max-w-md">
          Configure <code className="text-xs text-foreground">VITE_SUPABASE_URL</code> e{" "}
          <code className="text-xs text-foreground">VITE_SUPABASE_ANON_KEY</code> (ou{" "}
          <code className="text-xs text-foreground">NEXT_PUBLIC_*</code>) no ficheiro{" "}
          <code className="text-xs text-foreground">.env</code>.
        </p>
      </div>
    );
  }

  if (state === "no-session") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
