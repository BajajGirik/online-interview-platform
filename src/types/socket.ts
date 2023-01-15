/**
 * This is an "event" to "listener" map that provides an autocomplete
 * and typesafe way to write socket.io code
 * These events are emmited from client side and are handled
 * by the server side
 */
export type ClientToServerEvents = {
  joinRoom: (params: JoinRoomParamsType) => void;
  requestJoin: (roomIdToJoin: string, userIdToJoin: string) => void;
};

/**
 * This is an "event" to "listener" map that provides an autocomplete
 * and typesafe way to write socket.io code
 * These events are emmited from server side and are handled
 * by the client side
 */
export type ServerToClientEvents = {
  userConnected: () => void;
  joinRequestAccept: () => void;
  joinRequestReject: () => void;
};

/************** Types for listeners parameters ******************/
export type JoinRoomParamsType = {
  roomId: string;
};
