import { Metadata } from "next";
import { UserRegisterForm } from "@/components/auth/user-register-form";

export const metadata: Metadata = {
  title: "Register",
  description: "Register",
};

const RegisterPage = () => {
  return <UserRegisterForm />;
};

export default RegisterPage;
