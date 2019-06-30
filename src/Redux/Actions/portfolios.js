import fire from "../../fire";

/////////////////////
///// FIREBASE /////
/////////////////////

// **  Initializers **
// Initializers are usually set on componentDidMount, they only need to be set once, and will
// automatically update with a action dispatch whenever there is a change in that data
// in firebase. For example, getMessages is initialized, and calls updateMessages whenever
// there is a change in data.

export const portfolioListner = key => dispatch => {
  console.log("portfolioListner", key);
  fire
    .database()
    .ref(`${key}/portfolios`)
    .on("value", snap => {
      let coinData = {};
      console.log("GOT SOMETHING", snap);
      snap.forEach(coin => {
        const coinsObject = coin.val();
        const portfolioKey = coin.key;
        coinData[portfolioKey] = coinsObject;
      });
      dispatch({
        type: "UPDATE_PORTFOLIOS",
        payload: coinData
      });
    });
};

// Posts
export const addCoin = payload => dispatch => {
  fire
    .database()
    .ref("messages")
    .push(payload);
};

export const addCoinToPortfolio = ({ accountKey, coinInfo }) => {
  const portfolioKey = 1;
  fire
    .database()
    .ref(`${accountKey}/portfolios/${portfolioKey}/coins`)
    .push(coinInfo)
    .catch(error => {
      console.log("ADD COIN ERROR!@!!");
    });
};

export const editPortfolioCoin = ({ accountKey, coinKey, updatedObject }) => {
  console.log('editPortfolioCoin ACTION', updatedObject);
  const portfolioKey = 1;
    fire
      .database()
      .ref(`${accountKey}/portfolios/${portfolioKey}/coins`)
      .child(coinKey)
      .update(updatedObject)
      .catch(error => {
        console.log("Edit COIN ERROR!@!!");
    });
};

/////////////////////////////
///// Redux Actions /////////
/////////////////////////////

const updateMessages = payload => dispatch => {
  const message = { text: payload.val(), id: payload.key };
  dispatch({
    type: "UPDATE_MESSAGES",
    payload: message
  });
};
