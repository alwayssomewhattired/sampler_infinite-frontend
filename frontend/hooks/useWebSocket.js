import { useEffect, useState } from "react";
import { useDefaultUser } from "./useDefaultUser";

// TODO
// 1. IMPORTANT!!!!!! >>>>  MAKE SURE TO CHECK 'ME' FOR LOGGED IN USER ID. IF !ME, THEN USE DEFAULT_USER ID.

export const useWebSocket = (url, { onOpen, onMessage, onError, onClose }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const defaultUser = useDefaultUser();

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log("Connected!");
      setConnected(true);

      if (defaultUser) {
        const jsonMessage = JSON.stringify({
          action: "audioSend",
          body: "user_id",
          user_id: defaultUser,
        });
        ws.send(jsonMessage);
      }

      onOpen?.(ws);
    };

    ws.onmessage = (event) => {
      console.log("Received:", event.data);
      try {
        const message = JSON.parse(event.data);
        console.log("jsonparsed message: ", message);
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
