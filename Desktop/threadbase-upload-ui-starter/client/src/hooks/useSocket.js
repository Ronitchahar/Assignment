import { useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../auth/AuthContext.jsx";

export function useSocket(roomId) {
  const { token } = useAuth();
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token || !roomId) {
      socketRef.current = null;
      setMessages([]);
      return undefined;
    }

    const socket = io(
      import.meta.env.VITE_SOCKET_URL ?? "http://localhost:3001",
      {
        auth: { token },
      }
    );
    socketRef.current = socket;
    setMessages([]);

    const onConnect = () => {
      socket.emit("room:join", roomId);
    };
    const onMessage = (message) => {
      setMessages((previous) => [...previous, message]);
    };

    socket.on("connect", onConnect);
    socket.on("chat:message", onMessage);

    // Socket.IO may already be connected by the time listeners are attached.
    if (socket.connected) onConnect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("chat:message", onMessage);
      socket.disconnect();
      if (socketRef.current === socket) socketRef.current = null;
    };
  }, [token, roomId]);

  const sendMessage = useCallback(
    (text) => {
      const trimmedText = typeof text === "string" ? text.trim() : "";
      if (!trimmedText || !socketRef.current) return;
      socketRef.current.emit("chat:message", { roomId, text: trimmedText });
    },
    [roomId]
  );

  return { messages, sendMessage };
}
