import { io } from "socket.io-client";

const URL = "https://bottg-63go.onrender.com";

export const socket = io(URL, {
  autoConnect: false,
});
