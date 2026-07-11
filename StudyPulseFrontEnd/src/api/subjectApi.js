import apiClient from "./client";

export const getSubjectsApi = () => apiClient.get("/subjects");

export const createSubjectApi = (name) =>
  apiClient.post("/subjects", { name });
