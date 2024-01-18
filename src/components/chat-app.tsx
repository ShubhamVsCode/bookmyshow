import Sidebar from "./sidebar";

export function ChatApp({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <main className="flex flex-1 overflow-hidden">
        <Sidebar />
        {children}
      </main>
    </div>
  );
}
