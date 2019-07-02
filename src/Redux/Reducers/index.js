import { combineReducers } from "redux";
import messages from "./messages";
import auth from "./auth";
import portfolios from "./portfolios";
import coins from "./coins";

export default combineReducers({
  messages,
  auth,
  portfolios,
  coins,
});
