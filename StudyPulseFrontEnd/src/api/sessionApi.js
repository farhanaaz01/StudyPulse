import apiClient from "./client";

export const startSessionApi = (subjectId) =>
  apiClient.post("/sessions/start", { subjectId });

export const stopSessionApi = (sessionId, durationSeconds) =>
  apiClient.post(`/sessions/stop/${sessionId}`, { durationSeconds });

export const getHistoryApi = () => apiClient.get("/sessions/history");
