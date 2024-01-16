import { get, post } from "./index";
import { UserLoginData, UserRegisterData } from "@/types/auth";

interface UserResData {
  data?: {
    _id: string;
    name: string;
    email: string;
    token: string;
  };
  error?: string;
  success: boolean;
}

class AuthApi {
  static async getUserProfile() {
    return get<UserResData>("/user/profile");
  }

  static async login(data: UserLoginData): Promise<UserResData> {
    const payload = {
      email: data.email,
      password: data.password,
    };

    return post("/user/login", payload);
  }

  static async register(data: UserRegisterData): Promise<UserResData> {
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
    };

    return post("/user/register", payload);
  }
}

export default AuthApi;
