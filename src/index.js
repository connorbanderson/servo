import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";
import configureStore from "./Redux/store";
import history from "./history";
import * as serviceWorker from "./serviceWorker";
// Components
import AppController from "./AppController";
import Portfolio from "./Routes/Auth/Portfolio/Portfolio";
import Practice from "./Practice";
// Style Imports
import "./styles/global.scss";

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route exact path="/" component={AppController} />
    </Router>
  </Provider>,
  document.getElementById("root")
);

serviceWorker.register();
