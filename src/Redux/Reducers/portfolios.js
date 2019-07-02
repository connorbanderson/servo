const DEFAULT_STATE = {
  portfolios: null,
  selectedPortfolio: null
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case "UPDATE_PORTFOLIOS":
      return {
        portfolios: action.payload
      };
    default:
      return state;
  }
};
