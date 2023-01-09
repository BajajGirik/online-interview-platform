import { io } from "socket.io-client";

if (!process.env.REACT_APP_BACKEND_URL) {
  console.error("No BACKEND_SOCKET_URI present");
}

const BACKEND_SOCKET_URI = process.env.REACT_APP_BACKEND_URL || "";

const socket = io(BACKEND_SOCKET_URI, {
  reconnectionDelayMax: 10000
});

export default socket;
