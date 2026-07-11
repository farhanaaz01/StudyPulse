import apiClient from "./client";

export const getDashboardStatsApi = () =>
  apiClient.get("/dashboard/stats");

export const getDashboardStreakApi = () =>
  apiClient.get("/dashboard/streak");

export const getWeeklyProgressApi = () =>
  apiClient.get("/dashboard/weekly-progress");

export const fetchDashboardDataApi = () =>
  Promise.all([
    getDashboardStatsApi(),
    apiClient.get("/subjects"),
    getDashboardStreakApi(),
    getWeeklyProgressApi(),
  ]);
