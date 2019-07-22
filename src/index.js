import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";
import configureStore from "./Redux/store";
import history from "./history";
import * as serviceWorker from "./serviceWorker";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { purple } from "@material-ui/core/colors";
import { MATERIAL_PRIMARY_THEME_COLOR, MATERIAL_SECONDARY_THEME_COLOR } from './constants'
// Components
import AppController from "./AppController";
import Portfolio from "./Routes/Auth/Portfolio/Portfolio";
// Style Imports
import "./styles/global.scss";

const store = configureStore();

const theme = createMuiTheme({
  palette: {
    primary: { main: MATERIAL_PRIMARY_THEME_COLOR },
    secondary: { main: MATERIAL_SECONDARY_THEME_COLOR }
  },
  typography: {
    fontFamily: [
      "Poppins",
    ].join(",")
  }
});

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <Router history={history}>
        <Route path="/" component={AppController} />
      </Router>
    </ThemeProvider>
  </Provider>,
  document.getElementById("root")
);

serviceWorker.register();
