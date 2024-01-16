"use client";

import { cn } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";
import { ChangeEvent, HTMLAttributes, SyntheticEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthApi from "@/api/auth";
import { UserRegisterData, UserResponse } from "@/types/auth";
import { toast } from "sonner";
import { setAccessToken } from "@/helpers/token";
import userStore from "@/store/user";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

interface UserRegisterFormProps extends HTMLAttributes<HTMLDivElement> {}

export function UserRegisterForm({
  className,
  ...props
}: UserRegisterFormProps) {
  const router = useRouter();

  const { setUser, user } = userStore();
  const [isLoading, setIsLoading] = useState(false);

  const [registerData, setRegisterData] = useState<UserRegisterData>({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRegisterData({
      ...registerData,
      [event.target.name]: event.target.value,
    });
  };

  async function onSubmit(event: SyntheticEvent) {
    event.preventDefault();
    if (Object.values(registerData).some((value) => !value?.trim())) {
      toast.error("All fields are required");
      return;
    }

    setIsLoading(true);

    try {
      const response = await AuthApi.register(registerData);
      console.log(response);
      if (response?.success) {
        setUser(response.data as UserResponse);
        if (response?.data) setAccessToken(response?.data?.token);
        toast.success("Registration successful");
        router.replace("/");
      } else {
        toast.error(response.error || "Please check your credentials");
      }
    } catch (error: any) {
      console.log(error);
      if (!error?.success && error?.error) {
        toast.error(error?.error || "Please check your credentials");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-5">
          <div className="grid gap-1">
            <Label>Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              disabled={isLoading}
              value={registerData.name}
              onChange={handleChange}
            />
          </div>
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
              value={registerData.email}
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
              value={registerData.password}
              onChange={handleChange}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
          </Button>
        </div>
      </form>
      {/* <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button variant="outline" type="button" disabled={isLoading}>
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" />
        )}{" "}
        Github
      </Button> */}
    </div>
  );
}
