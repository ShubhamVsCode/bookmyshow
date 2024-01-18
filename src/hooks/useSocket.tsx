import { getAccessToken } from "@/helpers/token";
import { useCallback, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

interface MessagePayload {
  message: string;
  senderId: string;
  recipientId: string;
}

class WebSocketManager {
  private static instance: WebSocketManager;
  private socket: Socket | undefined;

  private constructor() {
    this.socket = io("http://localhost:4000", {
      extraHeaders: {
        token: getAccessToken() || "",
      },
    });
  }

  public static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  public getSocket(): Socket | undefined {
    return this.socket;
  }
}

const useSocket = (userId?: string) => {
  const [messages, setMessages] = useState<MessagePayload[]>([]);
  const [userMessages, setUserMessages] = useState<MessagePayload[]>([]);
  const [messageCountPerUser, setMessageCountPerUser] = useState<
    Record<string, number>
  >({});
  const socketManager = WebSocketManager.getInstance();
  const socket = socketManager.getSocket();

  const sendMessage = useCallback(
    (payload: MessagePayload) => {
      console.log(payload);

      if (socket) {
        socket.emit("event:message", payload);
      }
    },
    [socket]
  );

  const onMessageRec = useCallback((payload: MessagePayload) => {
    console.log("From Server Msg Rec", payload);
    setMessages((prev) => [...prev, payload]);
    setMessageCountPerUser((prev) => {
      return {
        ...prev,
        [payload.senderId]: (prev[payload.senderId] || 0) + 1,
      };
    });
    if (userId && payload.senderId === userId) {
      setUserMessages((prev) => [...prev, payload]);
    }
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("message", onMessageRec);
      return () => {
        socket.off("message", onMessageRec);
      };
    }
  }, [socket, onMessageRec]);

  return {
    socket,
    messages: userId ? userMessages : messages,
    messageCountPerUser,
    sendMessage,
  };
};

export default useSocket;
