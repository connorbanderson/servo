import React, { Component } from "react";
import { connect } from "react-redux";
import {
  signUp,
  login,
  loginWithGoogle,
  clearLoginError,
  clearSignUpError,
  authListener
} from "../../../Redux/Actions/auth";
// Frontend Lib Imports

// Util Import
import { validateEmail, validatePassword } from "../../../utils";

// Constants Import
import { CLIENT_VALIDATION_ERRORS } from "../../../constants";

// Style Imports
import "./login.scss";

//SVG Imports
import logo from "./logo.svg";
import googleIcon from "./googleIcon.svg";
import circuitboard from "./circuitboard.svg";
import circuitboardWhite from "./circuitboardWhite.svg";

//Component Imports
import Input from "../../../Components/Input/input.js";
import GradientButton from "../../../Components/GradientButton";

class Login extends Component {
  componentDidMount() {
    const { authListener } = this.props;
    //authListener();
  }

  state = {
    isLogin: true,
    signupEmail: null,
    signupEmailError: false,
    signupPassword: null,
    signupPasswordError: false,
    loginEmail: null,
    loginEmailError: false,
    loginPassword: null,
    loginPasswordError: false
  };

  handleSignupRequest = () => {
    const { signupEmail, signupPassword } = this.state;
    const { signUp } = this.props;
    const isValidEmail = validateEmail(signupEmail);
    const isValidPassword = validatePassword(signupPassword);
    if (isValidEmail && isValidPassword) {
      signUp(signupEmail, signupPassword);
    } else {
      this.setState({
        signupEmailError: !isValidEmail,
        signupPasswordError: !isValidPassword
      });
    }
  };

  handleLoginRequest = () => {
    const { loginEmail, loginPassword } = this.state;
    const { login } = this.props;
    const isValidEmail = validateEmail(loginEmail);
    const isValidPassword = validatePassword(loginPassword);
    if (isValidEmail && isValidPassword) {
      login(loginEmail, loginPassword);
    } else {
      this.setState({
        loginEmailError: !isValidEmail,
        loginPasswordError: !isValidPassword
      });
    }
  };

  render() {
    const {
      isLogin,
      loginEmailError,
      loginPasswordError,
      signupPasswordError,
      signupEmailError
    } = this.state;
    const {
      loginWithGoogle,
      auth,
      clearLoginError,
      clearSignUpError
    } = this.props;
    return (
      <section className="loginWrapper">
        <img src={logo} className="topRightLogo noselect" alt="logo" />
        <div className="innerBox">
          <div
            className={isLogin ? "slider sliderLogin" : "slider sliderSignup"}
          >
            <div
              style={{ marginTop: "250px" }}
              onClick={() => this.setState({ isLogin: !isLogin })}
              className="buttonSecondary"
            >
              <span>{!isLogin ? "Log In" : "Sign Up"}</span>
            </div>
          </div>

          <div
            className={
              !isLogin ? "leftBoxTextSlideIn boxText" : "leftBoxText boxText"
            }
          >
            <span className="largeText">Welcome Back!</span>
            <span className="mediumText">
              To keep connected with us please login with your personal info
            </span>
          </div>

          <div
            className={
              isLogin ? "rightBoxTextSlideIn boxText" : "rightBoxText boxText"
            }
          >
            <span className="largeText">Hello, Friend!</span>
            <span className="mediumText">
              Enter your login credentials to check out your portfolio
            </span>
          </div>

          <div
            className={
              isLogin ? "signIn signInActive" : "signIn signInInactive"
            }
          >
            <span className="largeText gradientText">Sign in to Servo</span>
            <div className="flex">
              <div
                onClick={() => loginWithGoogle()}
                className="socialWrapper flex"
              >
                <img
                  src={googleIcon}
                  alt="googleLoginIcon"
                  style={{ height: "70%", width: "70%" }}
                />
              </div>
              <div
                onClick={() => loginWithGoogle()}
                className="socialWrapper flex"
              >
                <img
                  src={googleIcon}
                  alt="googleLoginIcon"
                  style={{ height: "70%", width: "70%" }}
                />
              </div>
              <div
                onClick={() => loginWithGoogle()}
                className="socialWrapper flex"
              >
                <img
                  src={googleIcon}
                  alt="googleLoginIcon"
                  style={{ height: "70%", width: "70%" }}
                />
              </div>
            </div>
            <div className="smallText">or use your email account</div>
            <Input
              autoFocus
              label="Email"
              type="email"
              onChange={email => {
                this.setState({ loginEmail: email });
              }}
              handleSubmit={e => [
                e.preventDefault(),
                this.handleLoginRequest()
              ]}
              error={loginEmailError || auth.loginError !== null}
              helperText={
                loginEmailError ? CLIENT_VALIDATION_ERRORS['INVALID_EMAIL'] : null
              }
              clearError={() => [
                this.setState({
                  loginEmailError: false,
                  loginPasswordError: false
                }),
                clearLoginError()
              ]}
            />
            <div className="errorTextInputWrapper">
              <Input
                label="Password"
                type="password"
                onChange={password =>
                  this.setState({ loginPassword: password })
                }
                handleSubmit={e => [
                  e.preventDefault(),
                  this.handleLoginRequest()
                ]}
                error={loginPasswordError || auth.loginError !== null}
                helperText={
                  loginPasswordError
                    ? CLIENT_VALIDATION_ERRORS['PASSWORD_LENGTH']
                    : auth.loginError
                }
                clearError={() => [
                  this.setState({
                    loginEmailError: false,
                    loginPasswordError: false
                  }),
                  clearLoginError()
                ]}
              />
            </div>
            <GradientButton
              onClick={() => this.handleLoginRequest()}
              variant="contained"
              color="purple"
            >
              Log In
            </GradientButton>
            <span className="forgotText">Forgot your Password?</span>
          </div>

          <div
            className={
              !isLogin ? "signUp signUpActive" : "signUp signUpInactive"
            }
          >
            <span className="largeText gradientText">Sign up to Servo</span>
            <div className="flex">
              <div
                onClick={() => loginWithGoogle()}
                className="socialWrapper flex"
              >
                <img
                  src={googleIcon}
                  alt="googleLoginIcon"
                  style={{ height: "70%", width: "70%" }}
                />
              </div>
              <div
                onClick={() => loginWithGoogle()}
                className="socialWrapper flex"
              >
                <img
                  src={googleIcon}
                  alt="googleLoginIcon"
                  style={{ height: "70%", width: "70%" }}
                />
              </div>
              <div
                onClick={() => loginWithGoogle()}
                className="socialWrapper flex"
              >
                <img
                  src={googleIcon}
                  alt="googleLoginIcon"
                  style={{ height: "70%", width: "70%" }}
                />
              </div>
            </div>
            <div className="smallText">or use your email account</div>
            <Input
              label="Email"
              type="email"
              onChange={email => this.setState({ signupEmail: email })}
              label="Email"
              handleSubmit={e => [
                e.preventDefault(),
                this.handleSignupRequest()
              ]}
              error={signupEmailError || auth.signUpError !== null}
              helperText={
                signupEmailError
                  ? CLIENT_VALIDATION_ERRORS['INVALID_EMAIL']
                  : null
              }
              clearError={() => [
                this.setState({
                  signupEmailError: false,
                  signupPasswordError: false
                }),
                clearSignUpError()
              ]}
              ss
            />
            <div className="errorTextInputWrapper">
              <Input
                label="Password"
                type="password"
                onChange={password =>
                  this.setState({ signupPassword: password })
                }
                label="Password"
                handleSubmit={e => [
                  e.preventDefault(),
                  this.handleSignupRequest()
                ]}
                error={signupPasswordError || auth.signUpError !== null}
                helperText={
                  signupPasswordError
                    ? CLIENT_VALIDATION_ERRORS['PASSWORD_LENGTH']
                    : auth.signUpError
                }
                clearError={() => [
                  this.setState({
                    signupEmailError: false,
                    signupPasswordError: false
                  }),
                  clearSignUpError()
                ]}
              />
            </div>
            <GradientButton
              style={{ marginTop: "40px" }}
              onClick={() => this.handleSignupRequest()}
              variant="contained"
              color="purple"
            >
              Sign Up
            </GradientButton>
          </div>
          <img
            src={circuitboardWhite}
            className="topLeftCircuitBoardWhite"
            alt="topRightCircuitBoardWhite"
          />
          <img
            src={circuitboardWhite}
            className="botRightCircuitBoardWhite"
            alt="topRightCircuitBoardWhite"
          />
        </div>

        <div className="innerBox fakeInnerBox">
          <img
            src={circuitboard}
            className="topLeftCircuitBoard"
            alt="topRightCircuitBoardWhite"
          />
          <img
            src={circuitboard}
            className="botRightCircuitBoard"
            alt="topRightCircuitBoardWhite"
          />
        </div>
      </section>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = dispatch => ({
  loginWithGoogle: () => dispatch(loginWithGoogle()),
  signUp: (email, password) => dispatch(signUp(email, password)),
  login: (email, password) => dispatch(login(email, password)),
  clearLoginError: () => dispatch(clearLoginError()),
  clearSignUpError: () => dispatch(clearSignUpError()),
  authListener: () => dispatch(authListener())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
