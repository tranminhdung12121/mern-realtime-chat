import { useEffect, useRef, useState } from "react";
import { useSocketStore } from "@/stores/useSocketStore";

export const useTyping = (conversationId: string) => {
  const [isTyping, setIsTyping] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const socket = useSocketStore((state) => state.socket);

  const handleTyping = () => {
    if (!socket) return;

    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", conversationId);
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", conversationId);
      setIsTyping(false);
    }, 5000);
  };

  // cleanup khi đổi conversation
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      socket?.emit("stopTyping", conversationId);
    };
  }, [conversationId, socket]);

  return { handleTyping };
};
