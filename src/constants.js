export const AUTH_ERRORS = {
  EMAIL_IN_USE: "auth/email-already-in-use",
  BAD_EMAIL: "auth/invalid-email",
  WEAK_PASSWORD: "auth/weak-password",
  WRONG_PASSWORD: "auth/wrong-password",
  USER_NOT_FOUND: "auth/user-not-found"
};

export const AUTH_ERROR_MESSAGES = {
  [AUTH_ERRORS.BAD_EMAIL]: "The email address is badly formatted.",
  [AUTH_ERRORS.WEAK_PASSWORD]: "Password should be at least 6 characters",
  [AUTH_ERRORS.USER_NOT_FOUND]:
    "The password is invalid or the user does not have a password.",
  [AUTH_ERRORS.WRONG_PASSWORD]:
    "The password is invalid or the user does not have a password.",
  [AUTH_ERRORS.EMAIL_IN_USE]:
    "The email address is already in use by another account."
};

export const CLIENT_VALIDATION_ERRORS = {
  PASSWORD_LENGTH: "Password should be at least 6 characters",
  INVALID_EMAIL: "Please enter a valid email address"
};

export const PASSWORD_REGX = /.{6,}$/;
export const PORTFOLIO_NAME_REGX = /.{1,}$/;
export const EMAIL_REGX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const ONLY_INT_REGX = /\D/g;

export const AVATAR_PALETTE_400 = {
  0: "#ef5350",
  1: "#EC407A",
  2: "#AB47BC",
  3: "#7E57C2",
  4: "#5C6BC0",
  5: "#42A5F5",
  6: "#29B6F6",
  7: "#26C6DA",
  8: "#26A69A",
  9: "#66BB6A",
  10: "#9CCC65",
  11: "#FFA726",
  12: "#FF7043",
  13: "#78909C"
};

export const AVATAR_PALETTE_600 = {
  0: "#e53935",
  1: "#D81B60",
  2: "#8E24AA",
  3: "#5E35B1",
  4: "#3949AB",
  5: "#1E88E5",
  6: "#039BE5",
  7: "#00ACC1",
  8: "#00897B",
  9: "#43A047",
  10: "#7CB342",
  11: "#FB8C00",
  12: "#F4511E",
  13: "#546E7A"
};
