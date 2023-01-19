import API from "../config/axios";
import {
  UserSignupRequest,
  UserSigninRequest,
  UserAuthResponse,
  CreateRoomResponse,
  CreateRoomRequest,
  JoinRoomRequest,
  JoinRoomResponse
} from "../types/api";

export async function signup_api(payload: UserSignupRequest) {
  const { data } = await API.post<UserAuthResponse>("/auth/signup", payload);
  return data;
}

export async function signin_api(payload: UserSigninRequest) {
  const { data } = await API.post<UserAuthResponse>("/auth/signin", payload);
  return data;
}

export const autoLogin_api = async () => {
  const { data } = await API.get<UserAuthResponse>("/auth/autologin");
  return data;
};

export const createRoom_api = async (payload: CreateRoomRequest) => {
  const { data } = await API.post<CreateRoomResponse>("/room/createroom", payload);
  return data.roomId;
};

export const joinRoom_api = async (payload: JoinRoomRequest) => {
  const { data } = await API.post<JoinRoomResponse>("/room/joinroom", payload);
  return data.allowed;
};
