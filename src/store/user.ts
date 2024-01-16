import { USER_STORE } from "@/constants/common.constants";
import { UserResponse } from "@/types/auth";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserStoreState {
  user?: UserResponse;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  setUser: (user?: UserResponse) => void;
}

const userStore = create<UserStoreState>(
  persist(
    (set) => ({
      user: undefined,
      setUser: (user?: UserResponse) =>
        set((state: UserStoreState) => ({ ...state, user })),
      isLoading: false,
      setIsLoading: (isLoading: boolean) =>
        set((state: UserStoreState) => ({ ...state, isLoading })),
    }),
    {
      name: USER_STORE,
      storage: createJSONStorage(() => sessionStorage),
    } as any
  ) as any
);

export default userStore;
