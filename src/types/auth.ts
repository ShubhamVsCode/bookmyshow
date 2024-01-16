export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
}

export type UserLoginData = Pick<IUser, "email" | "password">;
export type UserRegisterData = Omit<IUser, "_id">;

export type UserResponse = Omit<IUser, "password">;
