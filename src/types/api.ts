/*********** Request Types ***********/
export type UserSigninRequest = {
  email: string;
  password: string;
};

export type UserSignupRequest = UserSigninRequest & {
  firstName: string;
  lastName: string;
  confirmPassword: string;
};

export type CreateRoomRequest = {
  hostEmail: string;
  intervieweeEmail: string;
};

export type JoinRoomRequest = {
  email: string;
  roomId: string;
};

/*********** Response Types ***********/
export type UserAuthResponse = {
  userProfile: UserProfile;
  token: string;
};

export type CreateRoomResponse = {
  roomId: string;
};

export type JoinRoomResponse = {
  allowed: boolean;
};

/*********** Extra Types ***********/
export type UserProfile = {
  _id: string;
  name: string;
  email: string;
  is_active: string;
  allowed_rooms: string[];
};
