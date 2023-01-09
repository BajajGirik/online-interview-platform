import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "../types/socket";

if (!process.env.REACT_APP_BACKEND_URL) {
  console.error("No BACKEND_SOCKET_URI present");
}

const BACKEND_SOCKET_URI = process.env.REACT_APP_BACKEND_URL || "";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(BACKEND_SOCKET_URI, {
  reconnectionDelayMax: 10000
});

export default socket;
