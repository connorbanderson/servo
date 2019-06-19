export default (state = { messages: [] }, action) => {
  switch (action.type) {
    case "UPDATE_MESSAGES":
      return {
        messages: [...state.messages, action.payload]
      };
    default:
      return state;
  }
};
