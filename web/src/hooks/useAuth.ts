import { AuthError, Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "../http/supabase";

const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSession(session);
      })
      .catch(() => {
        console.error(error);
        setError(error);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { session, error };
};

export default useAuth;
