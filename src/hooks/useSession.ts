import { useState } from "react";

/**
 * Custom hook to read and store data in session storage
 */
const useSession: <T>(
  key: string,
  initialState: T
) => readonly [T, (prevData: T) => void] = (key, initialState) => {
  const [session, setSession] = useState(() => {
    const sessionData = sessionStorage.getItem(key);
    return sessionData ? JSON.parse(sessionData) : initialState;
  });

  const setSessionData = <T>(data: T) => {
    setSession(() => {
      sessionStorage.setItem(key, JSON.stringify(data));
      return data;
    });
  };

  return [session, setSessionData] as const;
};

export default useSession;
