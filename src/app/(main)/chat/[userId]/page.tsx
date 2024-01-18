"use client";

import React, { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import ContactApi from "@/api/contact";
import useSocket from "@/hooks/useSocket";
import useContactStore from "@/store/contacts";
import userStore from "@/store/user";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AvatarImage } from "@/components/ui/avatar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { redirect } from "next/navigation";

const ChatPage = ({ params }: { params: { userId: string } }) => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const { user, isLoading } = userStore();
  const { contacts } = useContactStore();
  const { messages, sendMessage } = useSocket(params.userId);

  const [message, setMessage] = useState("");

  const handleSend = (e: FormEvent) => {
    e.preventDefault();

    const msg = message?.trim();

    if (msg && user)
      sendMessage({
        message: msg,
        senderId: user._id,
        recipientId: params.userId,
      });
    setMessage("");
  };

  useEffect(() => {
    // Scroll to the bottom when messages change
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  };

  const currentContact = useMemo(() => {
    return contacts.find((contact) => contact._id === params.userId);
  }, [contacts, params.userId]);

  if (!currentContact) return redirect("/");

  return (
    <section className="flex flex-col flex-1">
      <header className="flex items-center h-16 px-4 border-b border-slate-900 bg-white dark:bg-black">
        <Avatar className="w-10 h-10 border border-slate-500">
          <AvatarImage alt="@shadcn" src="/placeholder-user.jpg" />
          <AvatarFallback>{currentContact?.name[0]}</AvatarFallback>
        </Avatar>
        <h2 className="ml-4 text-lg font-semibold">{currentContact?.name}</h2>
      </header>
      <div className="flex-1 p-4 overflow-y-auto" ref={messagesContainerRef}>
        {/* grid-cols-[25px_1fr] */}
        <div className="mb-4 grid items-start pb-4 last:mb-0 last:pb-0">
          {messages.map((payload, i) => {
            return (
              <div className="grid gap-1" key={i}>
                <p className="text-sm font-medium">{payload.message}</p>
                <p className="text-sm font-medium">
                  Sender: {payload.senderId}
                </p>
                <p className="text-[.7rem] text-slate-500 dark:text-slate-400">
                  5 min ago
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="border-t border-slate-900 p-4">
        <form className="flex space-x-2" onSubmit={handleSend}>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1"
            placeholder="Type a message"
          />
          <Button type="submit" variant="outline">
            Send
          </Button>
        </form>
      </div>
    </section>
  );
};

export default ChatPage;
