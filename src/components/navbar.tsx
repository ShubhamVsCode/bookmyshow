"use client";

import AuthApi from "@/api/auth";
import { removeAccessToken, setAccessToken } from "@/helpers/token";
import { UserResponse } from "@/types/auth";
import userStore from "@/store/user";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { Loader2Icon, LogOutIcon, TextIcon } from "lucide-react";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";

const Navbar = () => {
  const router = useRouter();
  const { isLoading, setIsLoading, setUser, user } = userStore();

  const logout = useCallback(() => {
    removeAccessToken();
    setUser(undefined);
    router.replace("/login");
  }, []);

  useEffect(() => {
    async function getProfile() {
      setIsLoading(true);
      try {
        const data = await AuthApi.getUserProfile();
        if (data.success) {
          setUser(data.data as UserResponse);
          if (data?.data?.token) {
            setAccessToken(data.data.token);
          }
          router.replace("/");
        } else {
          logout();
        }
      } catch (error) {
        logout();
      } finally {
        setIsLoading(false);
      }
    }

    getProfile();
  }, []);

  return (
    <header className="flex items-center h-16 px-4 border-b border-slate-900 bg-white dark:bg-black">
      <Link className="flex items-center gap-2 text-lg font-semibold" href="#">
        <TextIcon className="w-6 h-6" />
        <span className="sr-only">ChatApp</span>
      </Link>
      <div className="flex-1 ml-auto">
        <form className="max-w-sm mx-auto">
          <Input className="rounded-full" placeholder="Search" type="search" />
        </form>
      </div>
      <Link
        className="flex items-center gap-2 text-lg font-semibold"
        href="/profile"
      >
        <Avatar className="w-10 h-10 border">
          <AvatarFallback>{user?.name?.[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className="sr-only">Profile</span>
      </Link>

      <Button className="ml-4" variant={"outline"} onClick={logout}>
        <LogOutIcon />
      </Button>
    </header>
  );
};

export default Navbar;
