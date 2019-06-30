import { AUTH_ERRORS, AUTH_ERROR_MESSAGES } from "../../constants.js";

const default_state = {
  isAuthed: false,
  loading: false,
  user: null,
  loginError: null,
  signUpError: null
};

export default (state = default_state, action) => {
  switch (action.type) {
    case "SIGN_UP_REQUEST":
      return {
        ...state,
        loading: true
      };
    case "SIGN_UP_FAIL":
      return {
        ...state,
        loading: false,
        signUpError: action.payload
      };
    case "LOGIN_WITH_GOOGLE_REQUEST":
      return {
        ...state,
        loading: true
      };
    case "LOGIN_WITH_GOOGLE_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case "LOGIN_REQUEST":
      return {
        ...state,
        loading: true
      };
    case "LOGIN_FAIL":
      return {
        ...state,
        loading: false,
        loginError: action.payload
      };
    case "CLEAR_LOGIN_ERROR":
      return {
        ...state,
        loading: false,
        loginError: null
      };
    case "CLEAR_SIGN_UP_ERROR":
      return {
        ...state,
        loading: false,
        signUpError: null
      };
    case "SIGN_UP_REQUEST":
      return {
        ...state,
        loading: true
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload
      };
    default:
      return state;
  }
};
