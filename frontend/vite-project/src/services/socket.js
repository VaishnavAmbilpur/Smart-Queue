import React from "react";
import { io } from "socket.io-client";

export const socket = io("https://smart-queue-5-d0u8.onrender.com/", {
  withCredentials: true
});
