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
    newUser: "New User?",
    existingUser: "Existing User?"
  },
  homePage: {
    heading: "Online Interview Platform",
    createRoom: "Create a room",
    logout: "Logout",
    joinRoom: "Join a room",
    inputPlaceholders: {
      intervieweEmail: "Interviewee's email",
      roomId: "Room Id"
    },
    errors: {
      roomIdEmpty: "Room Id cannot be empty",
      emailIdEmpty: "Email Id cannot be empyty",
      createRoomFailed: "Error creating room Id",
      joinRoomFailed: "Error joining room",
      notAllowedToJoinRoom: "You are not allowed to join this room",
      loginToPerformAction: "Please login to perform this action"
    }
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
  signUp: "/signup",
  signIn: "/signin",
  room: (roomId?: string) => "/room/" + (roomId ?? ":roomId")
};
