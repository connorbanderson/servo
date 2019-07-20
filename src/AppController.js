import React, { Component } from "react";
import { connect } from "react-redux";
// Redux Imports
import { authListener } from "./Redux/Actions/auth";
// Route Imports
import Login from "./Routes/NoAuth/Login/login";
import AuthController from "./Routes/Auth/AuthController";

class AppController extends Component {
  componentDidMount() {
    const { authListener } = this.props;
    authListener();
  }
  render() {
    const { isAuthed, initialUserCheck } = this.props;
    console.log('do you have scope??', this.props)
    if (!initialUserCheck) return null;
    if (!isAuthed) return <Login />;
    else return <AuthController />;
  }
}

const mapStateToProps = state => ({
  isAuthed: state.auth.isAuthed,
  initialUserCheck: state.auth.initialUserCheck
});

const mapDispatchToProps = dispatch => ({
  authListener: payload => dispatch(authListener(payload))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppController);
