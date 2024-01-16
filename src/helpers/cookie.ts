const setCookie = (name: string, value: string, days: number) => {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + days);

  const cookieValue = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
  document.cookie = cookieValue;
};

const getCookie = (name: string): string | null => {
  if (typeof document !== "undefined") {
    const cookies = document.cookie.split("; ");
    const foundCookie = cookies.find((cookie) => {
      const [cookieName] = cookie.split("=");
      return cookieName === name;
    });

    if (foundCookie) {
      const [, cookieValue] = foundCookie.split("=");
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
};

const deleteCookie = (cookieName: string) => {
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export { setCookie, getCookie, deleteCookie };
