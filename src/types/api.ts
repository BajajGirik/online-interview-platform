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

/*********** Response Types ***********/
export type UserAuthResponse = {
  userProfile: UserProfile;
  token: string;
};

/*********** Extra Types ***********/
export type UserProfile = {
  _id: string;
  name: string;
  email: string;
  is_active: string;
  allowed_rooms: string[];
};
