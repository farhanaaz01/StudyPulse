import apiClient from "./client";

export const loginApi = (email, password) =>
  apiClient.post("/auth/login", { email, password });

export const signupApi = (name, email, password) =>
  apiClient.post("/auth/signup", { name, email, password });
