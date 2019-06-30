import { combineReducers } from "redux";
import messages from "./messages";
import auth from "./auth";
import portfolios from "./portfolios";

export default combineReducers({
  messages,
  auth,
  portfolios,
});
