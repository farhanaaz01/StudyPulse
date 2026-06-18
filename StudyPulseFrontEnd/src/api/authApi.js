import axios from "axios";

const API = "http://localhost:8080/api/auth";

export const loginApi = async (email, password) => {
  return axios.post(`${API}/login`, {
    email,
    password,
  });
};