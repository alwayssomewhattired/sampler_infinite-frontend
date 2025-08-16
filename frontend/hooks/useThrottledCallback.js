import { useRef, useCallback } from "react";

function useThrottledCallback(callback, limit) {
  const lastCallRef = useRef(0);

  return useCallback(
    (...args) => {
      const now = Date.now();
      if (now - lastCallRef.current >= limit) {
        lastCallRef.current = now;
        callback(...args);
      }
    },
    [callback, limit]
  );
}

export default useThrottledCallback;
