import React from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "https://smart-queue-5-d0u8.onrender.com/api",
  withCredentials: true
});

export default api;
