import axios from "axios";

export const AxiosInstance = axios.create({
  baseURL: "https://order-deliver-system-server.onrender.com/",
  timeout: 50000,
  withCredentials: true,
});