import { Metadata } from "next";
import { UserLoginForm } from "@/components/auth/user-login-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Login",
};

const LoginPage = () => {
  return <UserLoginForm />;
};

export default LoginPage;
