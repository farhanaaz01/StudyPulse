import apiClient from "./client";

export const getProfileApi = () => apiClient.get("/users/profile");

export const updateProfileApi = ({ username, email, currentPassword }) =>
  apiClient.put("/users/profile", {
    username,
    email,
    currentPassword: currentPassword || undefined,
  });

export const updatePasswordApi = (oldPassword, newPassword) =>
  apiClient.put("/users/settings/password", { oldPassword, newPassword });
