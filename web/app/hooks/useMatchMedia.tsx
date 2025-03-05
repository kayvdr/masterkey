import { useEffect, useState } from "react";

const useMatchMedia = (query: string): boolean => {
  const mq = window.matchMedia(query);
  const [matches, setMatch] = useState(mq.matches);

  useEffect(() => {
    mq.addEventListener("change", callback);
    return () => mq.removeEventListener("change", callback);
  }, []);

  const callback = (e: MediaQueryListEvent) => setMatch(e.matches);

  return matches;
};

export default useMatchMedia;
