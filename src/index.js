import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import configureStore from "./Redux/store";
import "./styles/global.scss";
import App from "./App";
import Portfolio from "./Routes/Auth/Portfolio/Portfolio";

import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <Provider store={configureStore()}>
    <Router>
      <Route exact path="/" component={App} />
      <Route path="/portfolio" component={Portfolio} />
    </Router>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
