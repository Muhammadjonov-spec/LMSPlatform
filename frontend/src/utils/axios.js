import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import { STRORAGE_KEY } from "./const";

const baseURL = import.meta?.env?.VITE_API_URL ?? "http://localhost:3000/api";

const apiInstance = axios.create({
  baseURL,
  timeout: 3000
});

export const apiInstanceAuth = axios.create({
  baseURL,
  timeout: 3000
});

apiInstanceAuth.interceptors.request.use(
  (config) => {
    try {
      const session = secureLocalStorage.getItem(STRORAGE_KEY);

      if (!session) return config;

      const token = typeof session === "string" ? session : session?.token ?? session?.data?.token;

      if (!token) return config;

      config.headers = {
        ...(config.headers || {}),
        Authorization: `JWT ${token}`
      };
    } catch (err) {
      void err;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

apiInstanceAuth.interceptors.response.use(
  (response) => response,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      try {
        secureLocalStorage.removeItem(STRORAGE_KEY);
      } catch (removeErr) {
        void removeErr;
      }
      if (typeof window !== "undefined") {
        window.location.replace("/manager/sign-in");
      }
    }
    return Promise.reject(err);
  }
);

export default apiInstance;
