"use client";

import { cn } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";
import { ChangeEvent, HTMLAttributes, SyntheticEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthApi from "@/api/auth";
import { UserLoginData, UserResponse } from "@/types/auth";
import { toast } from "sonner";
import userStore from "@/store/user";
import { setAccessToken } from "@/helpers/token";
import { useRouter } from "next/navigation";

interface UserLoginFormProps extends HTMLAttributes<HTMLDivElement> {}

export function UserLoginForm({ className, ...props }: UserLoginFormProps) {
  const router = useRouter();

  const { setUser, user } = userStore();
  const [isLoading, setIsLoading] = useState(false);

  const [loginData, setLoginData] = useState<UserLoginData>({
    email: "",
    password: "",
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [event.target.name]: event.target.value,
    });
  };

  async function onSubmit(event: SyntheticEvent) {
    event.preventDefault();

    if (Object.values(loginData).some((value) => !value?.trim())) {
      toast.error("All fields are required");
      return;
    }

    setIsLoading(true);

    try {
      const response = await AuthApi.login(loginData);

      if (response?.success) {
        setUser(response.data as UserResponse);
        if (response?.data) setAccessToken(response?.data?.token);
        router.replace("/");
        toast.success("Login successful");
      } else {
        toast.error(response.error || "Please check your credentials");
      }
    } catch (error) {
      console.log(error);
      toast.error("Please check your credentials");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-5">
          <div className="grid gap-1">
            <Label>Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              value={loginData.email}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-1">
            <Label>Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect="off"
              disabled={isLoading}
              value={loginData.password}
              onChange={handleChange}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
            Login
          </Button>
        </div>
      </form>
    </div>
  );
}
