const DEFAULT_STATE = {
  top250: [],
}

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case "UPDATE_TOP_250":
      return {
        ...state,
        top250: action.payload
      };
    default:
      return state;
  }
};
