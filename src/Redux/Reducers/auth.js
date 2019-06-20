const default_state = {
  isAuthed: false,
  loading: false,
  user: null
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
        error: action.payload
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
        error: action.payload
      };
    case "LOGOUT":
      return {
        default_state
      };
    default:
      return state;
  }
};
