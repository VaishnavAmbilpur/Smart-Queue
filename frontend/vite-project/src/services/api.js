import React from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "https://smart-queue-4-k7vw.onrender.com/api",
  withCredentials: true
});

export default api;
