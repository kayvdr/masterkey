import { AuthError, Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "../http/supabase";

const useAuth = () => {
  const [currentSession, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<AuthError | null>(null);

  const handleSession = async () => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSession(session);
      })
      .catch((error) => {
        console.error(error);
        setError(error);
      });
  };

  useEffect(() => {
    handleSession();
  }, []);

  supabase.auth.onAuthStateChange(handleSession);

  return { session: currentSession, error };
};

export default useAuth;
