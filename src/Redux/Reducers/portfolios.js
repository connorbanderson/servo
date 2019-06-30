export default (state = { portfolios: null }, action) => {
  switch (action.type) {
    case "UPDATE_PORTFOLIOS":
      return {
        portfolios: action.payload
      };
    default:
      return state;
  }
};
