import apiInstance, { apiInstanceAuth } from "../utils/axios";

export const postSignup = async (data) =>
  apiInstance.post("/auth/register", data).then((res) => res.data);

export const postSignIn = async (data) =>
  apiInstance.post("/auth/login", data).then((res) => res.data);

export const postGoogleAuth = async (idToken) =>
  apiInstance.post("/auth/google", { idToken, credential: idToken }).then((res) => res.data);

export const postLogout = async () =>
  apiInstanceAuth.post("/auth/logout").then((res) => res.data);

export const verifyEmailToken = async (token) =>
  apiInstance.get(`/auth/verify/${token}`).then((res) => res.data);

export const getMe = async () =>
  apiInstanceAuth.get("/auth/me").then((res) => res.data);
