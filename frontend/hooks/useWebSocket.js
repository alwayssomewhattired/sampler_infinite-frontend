import { useEffect, useState } from "react";

export const useWebSocket = (url, { onOpen, onMessage, onError, onClose }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log("Connected!");
      setConnected(true);
      onOpen?.(ws);
    };

    ws.onmessage = (event) => {
      console.log("Received:", event.data);
      try {
        const message = JSON.parse(event.data);
        onMessage?.(message, ws);
      } catch (error) {
        console.error(error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      onError?.(error, ws);
    };

    ws.onclose = () => {
      console.warn("WebSocket closed.");
      setConnected(false);
      onClose?.(ws);
    };

    setSocket(ws);

    return () => {
      console.log("Unmounting and closing socket.");
      ws.close();
    };
  }, [url]);

  return { socket, connected };
};
