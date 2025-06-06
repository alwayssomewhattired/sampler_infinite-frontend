import { useState, useEffect } from "react";

export function useDefaultUser() {
  const [defaultUser, setDefaultUser] = useState(() => {
    const stored = localStorage.getItem("defaultUser");
    return stored || crypto.randomUUID();
  });

  useEffect(() => {
    localStorage.setItem("defaultUser", defaultUser);
  }, [defaultUser]);

  return defaultUser;
}
