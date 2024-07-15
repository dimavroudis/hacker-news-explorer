import { useState } from "react";

/**
 * Hook to read and store data in local storage
 */
const useStorage: <T>(
  key: string,
  initialState: T
) => readonly [T, (prevData: T) => void] = (key, initialState) => {
  const [storage, setStorage] = useState(() => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : initialState;
  });

  const setStorageData = <T>(data: T) => {
    setStorage(() => {
      localStorage.setItem(key, JSON.stringify(data));
      return data;
    });
  };

  return [storage, setStorageData] as const;
};

export default useStorage;
