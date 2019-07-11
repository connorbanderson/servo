const DEFAULT_STATE = {
  portfolios: null,
  selectedPortfolio: null
};

const NO_INTERNET_DEFAULT_STATE = {
  portfolios: {
    "-LilMZOfwoln8QWYk5Dj": {
      coins: {
        LilMZOfwoln8QWYk5Dj: {
          amountInvested: 10000,
          amountPurchased: 300,
          coin: "bitcoin"
        }
      },
      name: "Kappa Ting"
    },
    "-ikVaP0DUtD-zV5bXyw": {
      coins: {
        coin1: {
          amountInvested: 10000,
          amountPurchased: 100,
          coin: "ethereum"
        },
        coin2: {
          amountInvested: 14000,
          amountPurchased: 1,
          coin: "bitcoin"
        }
      },
      name: "Kappa Ting"
    }
  },
  selectedPortfolio: null
};

export default (state = NO_INTERNET_DEFAULT_STATE, action) => {
  switch (action.type) {
    case "UPDATE_PORTFOLIOS":
      return {
        portfolios: action.payload
      };
    default:
      return state;
  }
};
