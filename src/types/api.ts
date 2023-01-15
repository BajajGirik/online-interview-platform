export type UserSigninRequest = {
  email: string;
  password: string;
};

export type UserSignupRequest = UserSigninRequest & {
  firstName: string;
  lastName: string;
  confirmPassword: string;
};
