import axios from "axios";

const API = "http://localhost:8080/api/users";

export const getCurrentUserApi = async () => {
  const token = localStorage.getItem("token");

  return axios.get(`${API}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
