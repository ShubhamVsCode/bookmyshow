import { ChatApp } from "@/components/chat-app";
import Navbar from "@/components/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <ChatApp>{children}</ChatApp>
    </>
  );
}
