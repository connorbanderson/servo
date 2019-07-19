import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";
import configureStore from "./Redux/store";
import history from "./history";
import * as serviceWorker from "./serviceWorker";
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { purple } from '@material-ui/core/colors';

// Components
import AppController from "./AppController";
import Portfolio from "./Routes/Auth/Portfolio/Portfolio";
import Practice from "./Practice";
// Style Imports
import "./styles/global.scss";

const store = configureStore();

const theme = createMuiTheme({
  palette: {
    primary: { main: '#406de9' },
    secondary: { main: '#E94057' },
  },
});

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <Router history={history}>
        <Route exact path="/" component={AppController} />
        <Route exact path="/practice" component={Practice} />
        <Route path="/portfolio/:id" component={Portfolio} />
      </Router>
    </ThemeProvider>
  </Provider>,
  document.getElementById("root")
);

serviceWorker.register();
