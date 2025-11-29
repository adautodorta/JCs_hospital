import type {Session} from "@supabase/supabase-js";
import {Loader2} from "lucide-react";
import {useState, useEffect} from "react";
import {Navigate, Outlet} from "react-router";

import {useRoleStore} from "@/store";
import {supabase} from "@/supabaseClient";
import routes from "@/utils/routes";

export function PrivateRoute() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const setRole = useRoleStore(state => state.setRole);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const {data: {session: currentSession}} = await supabase.auth.getSession();
        setSession(currentSession);

        const accessToken = currentSession?.access_token;
        if (accessToken) {
          localStorage.setItem("access_token", accessToken);
        }

        const {data} = await supabase
          .from("PROFILES")
          .select("role")
          .eq("id", currentSession?.user.id)
          .single();

        const role = typeof data?.role === "string" ? data.role : undefined;

        if (role) {
          setRole(role);
        }
      } catch (error) {
        console.error("Acesso não autorizado.:", error);
      } finally {
        setLoading(false);
      }
    };

    void checkSession();

    const {data: {subscription}} = supabase.auth.onAuthStateChange((_event, updatedSession) => {
      setSession(updatedSession);
      const t = updatedSession?.access_token;
      if (t) {
        localStorage.setItem("access_token", t);
      } else {
        localStorage.removeItem("access_token");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setRole]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to={routes.LOGIN} replace />;
  }

  return <Outlet />;
}
