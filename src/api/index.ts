import API from "../config/axios";
import { UserSignupResponse, UserSignupRequest, UserSigninRequest } from "../types/api";

export async function signup_api(payload: UserSignupRequest): Promise<UserSignupResponse> {
  const { data } = await API.post<UserSignupResponse>("/signup", payload);
  return data;
}

export async function signin_api(payload: UserSigninRequest): Promise<UserSignupResponse> {
  const { data } = await API.post<UserSignupResponse>("/signin", payload);
  return data;
}
