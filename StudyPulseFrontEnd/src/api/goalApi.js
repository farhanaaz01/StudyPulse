import apiClient from "./client";

export const getGoalsApi = () => apiClient.get("/goals");

export const createGoalApi = (goal) => apiClient.post("/goals", goal);

export const deleteGoalApi = (id) => apiClient.delete(`/goals/${id}`);
