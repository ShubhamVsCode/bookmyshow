const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || "";
const ACCESS_TOKEN = process.env.ACCESS_TOKEN_NAME || "token";
const TOKEN_EXPIRATION = Number(process.env.NEXT_PUBLIC_TOKEN_EXPIRATION || 3);
const USER_STORE = process.env.USER_STORE || "user";

export { baseApiUrl, ACCESS_TOKEN, TOKEN_EXPIRATION, USER_STORE };
