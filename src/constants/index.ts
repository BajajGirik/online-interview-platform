export const LOCAL_STORAGE_KEY = "Oip_data";

export const Strings = {
  authPage: {
    inputPlaceholders: {
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password"
    },
    signUp: "Sign Up",
    signIn: "Sign In",
    newUser: "New User",
    existingUser: "Existing User?"
  }
};

export const ErrorMessages = {
  invalidEmail: "Please enter a valid email",
  invalidPassword:
    "Password must contain uppercase, number and should be greater than 8 characters",
  passwordMismatch: "Passwords don't match",
  emptyField: "Field cannot be empty"
};

export const AppRoutes = {
  home: "/",
  signUp: "/signUp",
  signIn: "/signIn",
  room: (roomId?: string) => "/room/" + (roomId ?? ":roomId")
};
