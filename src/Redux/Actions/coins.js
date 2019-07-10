/////////////////////////////
///// Redux Actions /////////
/////////////////////////////

export const fetchTop250 = () => dispatch => {
  console.log("trying to fetch top 250");
  const reqUrl =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=USD&order=market_cap_desc&per_page=250&page=1&sparkline=true&price_change_percentage=1h,24h,7d,30d,200d,1y";
  let payload = fetch(reqUrl)
    .then(res => res.json())
    .then(
      coins => {
        dispatch({
          type: "UPDATE_TOP_250",
          payload: coins
        });
      },
      error => {
        console.log("Error Fetching top 250!", error);
      }
    );
};
