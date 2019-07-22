import fire from "../../fire";

/////////////////////
///// FIREBASE /////
/////////////////////

// **  Initializers **
// Initializers are usually set on componentDidMount, they only need to be set once, and will
// automatically update with a action dispatch whenever there is a change in that data
// in firebase. For example, getMessages is initialized, and calls updateMessages whenever
// there is a change in data.

export const portfolioListner = () => (dispatch, getState) => {
  const { auth } = getState();
  fire
    .database()
    .ref(`${auth.user.uid}/portfolios`)
    .on("value", snap => {
      const portfoliosObject = {}
      snap.forEach(portfolio => {
        const portfolioObject = portfolio.val();
        portfoliosObject[portfolio.key] = portfolioObject;
      });
      dispatch({
        type: "UPDATE_PORTFOLIOS",
        payload: portfoliosObject
      });
    });
};

// Posts
export const createPortfolio = (accountKey, payload) => {
  console.log("Trying to createPortfolio", accountKey, payload);
  fire
    .database()
    .ref(`${accountKey}/portfolios`)
    .push(payload)
    .catch(error => {
      console.log("Create Portfolio ERROR!@!!");
    });
};

export const addCoinToPortfolio = ({ accountKey, portfolioKey, coinInfo }) => {
  fire
    .database()
    .ref(`${accountKey}/portfolios/${portfolioKey}/coins`)
    .push(coinInfo)
    .catch(error => {
      console.log("ADD COIN ERROR!@!!");
    });
};

export const deleteCoinFromPortfolio = ({
  accountKey,
  portfolioKey,
  coinKey
}) => {
  console.log("deleteCoinFromPortfolio ACTION", accountKey, coinKey);
  fire
    .database()
    .ref(`${accountKey}/portfolios/${portfolioKey}/coins`)
    .child(coinKey)
    .remove()
    .catch(error => {
      console.log("Delete COIN ERROR!@!!");
    });
};

export const editPortfolioName = ({ accountKey, portfolioKey, newName }) => {
  console.log(
    "editPortfolioName ACTION:  accountKey, coinKey, newName",
    accountKey,
    portfolioKey,
    newName
  );
  fire
    .database()
    .ref(`${accountKey}/portfolios/${portfolioKey}`)
    .update({ name: newName })
    .catch(error => {
      console.log("Edit COIN ERROR!@!!");
    });
};

export const deletePortfolio = ({ accountKey, portfolioKey }) => {
  fire
    .database()
    .ref(`${accountKey}/portfolios/${portfolioKey}`)
    .remove()
    .catch(error => {
      console.log("Edit COIN ERROR!@!!");
    });
};

export const editPortfolioCoin = ({
  accountKey,
  portfolioKey,
  coinKey,
  updatedObject
}) => {
  console.log(
    "editPortfolioCoin ACTION:  accountKey, coinKey, updatedObject",
    accountKey,
    coinKey,
    updatedObject
  );
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
