/**
 * This is an "event" to "listener" map that provides an autocomplete
 * and typesafe way to write socket.io code
 * These events are emmited from client side and are handled
 * by the server side
 */
export type ClientToServerEvents = {
  /**
   * Basic event fired from client at first to share that
   * user connected. Just a notification event, nothing else
   */
  joinRoom: (params: JoinRoomParamsType) => void;

  /**
   * Functionality driven:
   * This is the first step happening when we want to communicate
   * and send data between peers.
   */
  sendSignal: (params: SendSignalParamsType) => void;

  sendPiggyBackSignal: (params: PiggyBackParamsType) => void;

  callUser: (params: ClientToServerCallUserType) => void;
  answerCall: (params: { data: any }) => void;
};

/**
 * This is an "event" to "listener" map that provides an autocomplete
 * and typesafe way to write socket.io code
 * These events are emmited from server side and are handled
 * by the client side
 */
export type ServerToClientEvents = {
  /**
   * Basic event fired by server to share that
   * user connected. Just a notification event, nothing else
   */
  userJoined: (params: UserJoinedParamsType) => void;

  /**
   * After a user send's signal to server, an event "receiveSignal"
   * is emitted to the user who was meant to receive this signal
   */
  receiveSignal: (params: ReceiverSignalParamsType) => void;

  acknowledgeSignal: (params: AcknowledgeSignalParamsType) => void;

  me: (parames: string) => void;
  callEnded: () => void;
  callUser: (params: ServerToClientCallUserType) => void;
  callAccepted: (params: { signal: any }) => void;
};

/************** Types for listeners parameters ******************/
export type JoinRoomParamsType = {
  roomId: string;
  email: string;
};

export type UserJoinedParamsType = {
  email: string;
};

export type SendSignalParamsType = {
  // TODO: Remove type "any"
  signal: any;
  roomId: string;
  email: string;
  // Since we are implementing a two client meeting
  // We don't necessarily need the receiverId as we
  // can easily get that from DB.
};

export type ReceiverSignalParamsType = {
  // TODO: Remove type "any"
  signal: any;
};

export type PiggyBackParamsType = SendSignalParamsType;

export type AcknowledgeSignalParamsType = ReceiverSignalParamsType;

export type ClientToServerCallUserType = {
  userToCall: string;
  signalData: any;
  callFrom: any;
  name: string;
};

export type ServerToClientCallUserType = {
  signal: any;
  callFrom: any;
  name: string;
};
