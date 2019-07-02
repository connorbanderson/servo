import React, { Component } from "react";
import { connect } from "react-redux";
import Login from "./Routes/NoAuth/Login/login";
import AuthController from "./Routes/Auth/AuthController";
import { authListener } from "./Redux/Actions/auth";
class AppController extends Component {
  componentDidMount() {
    const { authListener } = this.props;
    authListener();
  }
  render() {
    const { isAuthed } = this.props;
    if (!isAuthed) return <Login />;
    else return <AuthController />;
  }
}

const mapStateToProps = state => ({
  isAuthed: state.auth.isAuthed
});

const mapDispatchToProps = dispatch => ({
  authListener: payload => dispatch(authListener(payload))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppController);
