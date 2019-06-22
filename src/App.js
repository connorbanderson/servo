import React, { Component } from "react";
import { connect } from "react-redux";
import { addMessage, getMessages } from "./Redux/Actions/messages";
import fire from "./fire";
import firebase from "firebase";
import "./App.scss";
import { logout } from "./Redux/Actions/auth";
import Login from "./Routes/NoAuth/Login/login.js";
import Button from "@material-ui/core/Button";
import MarketCard from "./Components/MarketCard";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import Input from '@material-ui/core/Input';
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import DirectionsIcon from "@material-ui/icons/Directions";

import Autocomplete from "./Components/Autocomplete";



class App extends Component {
  componentWillMount() {
    const { getMessages } = this.props;
    getMessages();
    this.authListener();
  }

  state = {
    isLogin: false,
    user: null,
    email: null,
    password: null,
    coins: []
  };

  authListener() {
    fire.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ user: user });
      } else {
        this.setState({ user: null });
      }
    });
  }

  getCoins = () => {
    const reqUrl =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=USD&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage='1h%2C24h%2C7d%2C%2014d%2C%2030d%2C%20200d%2C%201y'%20";
    fetch(reqUrl)
      .then(res => res.json())
      .then(
        coins => {
          this.setState({ coins: coins });
        },
        error => {
          console.log("error", error);
        }
      );
  };

  render() {
    const { addMessage, messages, logout } = this.props;
    const { user, isLogin, coins } = this.state;
    console.log(coins);
    return (
      <div className="App">
        {!user ? (
          <Login />
        ) : (
          <div className="dashboardWrapper">
            <nav className="dashboardNavbar">
              <div className="navbarInnerWrapper">
                <div className="lhs" />
                <div className="middle">
                  <Autocomplete />
                </div>
                <div className="rhs">
                  <Button
                    style={{ marginRight: "10px" }}
                    onClick={() => this.getCoins()}
                    variant="contained"
                  >
                    Get Coins
                  </Button>
                  <Button onClick={() => logout()} variant="contained">
                    Logout
                  </Button>
                </div>
              </div>
            </nav>

            <div className="dashboardInnerWrapper">
              {coins.map(coin => (
                <MarketCard key={coin.name} coin={coin} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  messages: state.messages.messages
});

const mapDispatchToProps = dispatch => ({
  addMessage: payload => dispatch(addMessage(payload)),
  getMessages: () => dispatch(getMessages()),
  logout: () => dispatch(logout())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

/*

<Input
  style={{ marginLeft: "20px", width: '200px' }}
  placeholder="Search"
  inputProps={{ "aria-label": "Search For Coins" }}
/>
<IconButton aria-label="Search">
  <SearchIcon />
</IconButton>

*/
