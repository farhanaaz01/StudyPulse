import axios from "axios";

const API = "http://localhost:8080/api/sessions";

export const startSessionApi = async (subjectId) => {
  const token = localStorage.getItem("token");

  return axios.post(
    `${API}/start`,
    { subjectId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const stopSessionApi = async (sessionId) => {
  const token = localStorage.getItem("token");

  return axios.post(
    `${API}/stop/${sessionId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getHistoryApi = async () => {
  const token = localStorage.getItem("token");

  return axios.get(`${API}/history`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};