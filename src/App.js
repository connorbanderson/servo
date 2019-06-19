import React, { Component } from "react";
import { connect } from "react-redux";
import { addMessage, getMessages } from "./Redux/Actions/messages";
import fire from "./fire";
import firebase from "firebase";
import "./App.scss";

import Login from './Routes/NoAuth/Login/login.js'

class App extends Component {
  componentWillMount() {
    const { getMessages } = this.props;
    getMessages();
    this.authListener();
  }

  state = {
    isLogin: true,
    user: null,
    email: null,
    password: null
  };

  authListener() {
    fire.auth().onAuthStateChanged(user => {
      if (user) {
        console.log("WE hAVE A NEW USER!!!", user);
        this.setState({ user: user });
      } else {
        this.setState({ user: null });
      }
    });
  }

  handleLogin = e => {
    const { email, password } = this.state;
    // in case I hook this up to a form, will prevent page reload
    e.preventDefault();
    fire
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(u => {
        console.log("PROMISE RETURN!!!");
      })
      .catch(error => {
        console.log(error);
      });
  };

  handleLoginWithGoogle = () => {
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    fire
      .auth()
      .signInWithPopup(googleProvider)
      .then(u => {
        console.log("PROMISE RETURN!!!");
      })
      .catch(error => {
        console.log(error);
      });
  };



  handleLogout = () => {
    fire.auth().signOut();
  };

  handleSignup = e => {
    const { email, password } = this.state;
    // in case I hook this up to a form, will prevent page reload
    e.preventDefault();
    fire
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(u => {
        console.log("PROMISE RETURN!!!");
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const { addMessage, messages } = this.props;
    const { user, isLogin } = this.state;
    return (
      <div className="App">

        {
          user ? <span> WOOT </span> : <Login />
        }

      </div>
    );
  }
}

const mapStateToProps = state => ({
  messages: state.messages.messages
});

const mapDispatchToProps = dispatch => ({
  addMessage: payload => dispatch(addMessage(payload)),
  getMessages: () => dispatch(getMessages())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
