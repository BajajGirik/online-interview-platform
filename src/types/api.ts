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
export type UserSigninResponse = {
  name: string;
  email: string;
  token: string;
};

export type UserSignupResponse = UserSigninResponse;
