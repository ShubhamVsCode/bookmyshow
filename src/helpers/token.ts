import { ACCESS_TOKEN, TOKEN_EXPIRATION } from "@/constants/common.constants";
import { deleteCookie, getCookie, setCookie } from "./cookie";

const getAccessToken = () => getCookie(ACCESS_TOKEN);

const removeAccessToken = () => {
  deleteCookie(ACCESS_TOKEN);
  localStorage.removeItem(ACCESS_TOKEN);
};

const setAccessToken = (token: string) => {
  setCookie(ACCESS_TOKEN, token, TOKEN_EXPIRATION);
  localStorage.setItem(ACCESS_TOKEN, token);
};

export { getAccessToken, removeAccessToken, setAccessToken };
