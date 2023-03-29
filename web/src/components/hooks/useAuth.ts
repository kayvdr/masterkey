import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "../../http/supabase";

const useAuth = () => {
  const [currentSession, setSession] = useState<Session | null>(null);
  const [loaded, setLoaded] = useState(false);

  const handleSession = async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    setLoaded(true);

    if (error) return;

    setSession(session);
  };

  useEffect(() => {
    handleSession();
  }, []);

  supabase.auth.onAuthStateChange(() => handleSession());

  return { loaded, session: currentSession };
};

export default useAuth;
