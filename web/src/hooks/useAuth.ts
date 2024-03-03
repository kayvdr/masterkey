import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "../http/supabase";

const useAuth = () => {
  const [currentSession, setSession] = useState<Session | null>(null);

  const handleSession = async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    !error && setSession(session);
  };

  useEffect(() => {
    handleSession();
  }, []);

  supabase.auth.onAuthStateChange(handleSession);

  return { session: currentSession };
};

export default useAuth;
