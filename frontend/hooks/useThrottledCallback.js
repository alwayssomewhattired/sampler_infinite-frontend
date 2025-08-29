import { useRef, useCallback } from "react";

function useThrottledCallback(callback, limit) {
  const lastCallRef = useRef(0);
  const timeoutRef = useRef(null);
  const lastArgsRef = useRef(null);

  return useCallback(
    (...args) => {
      const now = Date.now();
      lastArgsRef.current = args;

      if (now - lastCallRef.current >= limit) {
        lastCallRef.current = now;
        callback(...args);
      } else {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
          lastCallRef.current = Date.now();
          callback(...lastArgsRef.current);
        }, limit - (now - lastCallRef.current));
      }
    },
    [callback, limit]
  );
}

export default useThrottledCallback;
