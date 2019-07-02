import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import configureStore from "./Redux/store";
import "./styles/global.scss";
import App from "./App";
import AppController from "./AppController";
import Login from "./Routes/NoAuth/Login/login.js";
import history from './history';

import Portfolio from "./Routes/Auth/Portfolio/Portfolio";

import * as serviceWorker from "./serviceWorker";

const store = configureStore()

const { auth } = store.getState()

console.log('Index, Auth', auth)

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route exact path="/" component={AppController} />
      <Route path="/portfolio/:id" component={Portfolio} />
    </Router>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
