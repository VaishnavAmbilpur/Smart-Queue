import React from "react";
import { io } from "socket.io-client";

export const socket = io("https://smart-queue-4-k7vw.onrender.com/", {
  withCredentials: true
});
