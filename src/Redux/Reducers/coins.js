const DEFAULT_STATE = {
  top250: []
};

const NO_INTERNET_DEFAULT_STATE = {
  top250: [
    {
      ath: 19665,
      ath_change_percentage: -33.677,
      ath_date: "2017-12-16T00:00:00.000Z",
      circulating_supply: 17809912,
      current_price: 12946,
      high_24h: 13118,
      id: "bitcoin",
      image:
        "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579",
      last_updated: "2019-07-10T14:13:17.491Z",
      low_24h: 12220,
      market_cap: 231423673191,
      market_cap_change_24h: 11219947307,
      market_cap_change_percentage_24h: 5.09526,
      market_cap_rank: 1,
      name: "Bitcoin",
      price_change_24h: 592.168,
      price_change_percentage_1h_in_currency: -0.713163361617623,
      price_change_percentage_1y_in_currency: 94.7309494942251,
      price_change_percentage_7d_in_currency: 19.6202131923291,
      price_change_percentage_24h: 4.79332,
      price_change_percentage_24h_in_currency: 4.79331654272139,
      price_change_percentage_30d_in_currency: 68.8336406061802,
      price_change_percentage_200d_in_currency: 236.595107550118,
      roi: null,
      sparkline_in_7d: { price: new Array(165).fill(100) },
      symbol: "btc",
      total_supply: 21000000,
      total_volume: 34890525377
    },
    {
      ath: 1448,
      ath_change_percentage: -78.70354,
      ath_date: "2018-01-13T00:00:00.000Z",
      circulating_supply: 106841245.1241,
      current_price: 306.094,
      high_24h: 314.471,
      id: "ethereum",
      image:
        "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1547034048",
      last_updated: "2019-07-10T14:13:14.910Z",
      low_24h: 303.556,
      market_cap: 32850042665,
      market_cap_change_24h: -417102553.349506,
      market_cap_change_percentage_24h: -1.2538,
      market_cap_rank: 2,
      name: "Ethereum",
      price_change_24h: -5.1873745792,
      price_change_percentage_1h_in_currency: -0.795403377411049,
      price_change_percentage_1y_in_currency: -34.8323922366378,
      price_change_percentage_7d_in_currency: 5.20141993456771,
      price_change_percentage_24h: -1.66646,
      price_change_percentage_24h_in_currency: -1.66645996003231,
      price_change_percentage_30d_in_currency: 31.9132980373962,
      price_change_percentage_200d_in_currency: 183.805914074256,
      roi: {
        times: 30.528589635465504,
        currency: "btc",
        percentage: 3052.8589635465505
      },
      sparkline_in_7d: { price: new Array(165).fill(100) },
      symbol: "eth",
      total_supply: null,
      total_volume: 13220565873
    }
  ]
};

export default (state = NO_INTERNET_DEFAULT_STATE, action) => {
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
