import React, { Component } from "react";
import { connect } from "react-redux";
import { addMessage, getMessages } from "./Redux/Actions/messages";
import fire from "./fire";
import firebase from "firebase";
import "./App.scss";
import { logout } from "./Redux/Actions/auth";
import Login from "./Routes/NoAuth/Login/login.js";

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
    password: null
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

  render() {
    const { addMessage, messages, logout } = this.props;
    const { user, isLogin } = this.state;
    return (
      <div className="App">
        {user ? <button onClick={() => logout()}>Logout</button> : <Login />}
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
