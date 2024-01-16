"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import userStore from "@/store/user";

export function ChatApp() {
  const { user, isLoading } = userStore();
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <main className="flex flex-1 overflow-hidden">
        <aside className="w-80 border-r bg-white dark:bg-black overflow-y-auto">
          <nav className="space-y-1 p-4">
            <Link
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
              href="#"
            >
              <Avatar className="w-10 h-10 border">
                <AvatarImage alt="@shadcn" src="/placeholder-user.jpg" />
                <AvatarFallback>AC</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-medium line-clamp-1">Alice Chen</h2>
                <p className="text-sm text-slate-500 line-clamp-1 dark:text-slate-400">
                  Hey, are you there?
                </p>
              </div>
            </Link>
            <Link
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
              href="#"
            >
              <Avatar className="w-10 h-10 border">
                <AvatarImage alt="@jaredpalmer" src="/placeholder-user.jpg" />
                <AvatarFallback>JP</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-medium line-clamp-1">
                  Jared Palmer
                </h2>
                <p className="text-sm text-slate-500 line-clamp-1 dark:text-slate-400">
                  Let&apos;s catch up soon!
                </p>
              </div>
            </Link>
          </nav>
        </aside>
        <section className="flex flex-col flex-1">
          <header className="flex items-center h-16 px-4 border-b bg-white dark:bg-black">
            <Avatar className="w-10 h-10 border">
              <AvatarImage alt="@shadcn" src="/placeholder-user.jpg" />
              <AvatarFallback>AC</AvatarFallback>
            </Avatar>
            <h2 className="ml-4 text-lg font-semibold">Alice Chen</h2>
          </header>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
              <Avatar className="w-6 h-6 border">
                <AvatarImage alt="@shadcn" src="/placeholder-user.jpg" />
                <AvatarFallback>AC</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium">Hey, are you there?</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  5 min ago
                </p>
              </div>
            </div>
          </div>
          <div className="border-t p-4">
            <form className="flex space-x-2">
              <Input className="flex-1" placeholder="Type a message" />
              <Button type="submit" variant="outline">
                Send
              </Button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

function TextIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 6.1H3" />
      <path d="M21 12.1H3" />
      <path d="M15.1 18H3" />
    </svg>
  );
}
