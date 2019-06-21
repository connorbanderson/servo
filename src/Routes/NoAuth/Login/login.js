import React, { Component } from "react";
import { connect } from "react-redux";
import { signUp, login, loginWithGoogle, clearLoginError } from "../../../Redux/Actions/auth";
import { makeStyles } from "@material-ui/styles";
import GradientButton from "../../../Components/GradientButton";

// Frontend Lib Imports

// Style Imports
import "./login.scss";

//SVG Imports
import circle from "./circle.svg";
import circleWhite from "./circleWhite.svg";
import triangle from "./triangle.svg";
import triangleWhite from "./triangleWhite.svg";
import logo from "./logo.svg";
import googleIcon from "./googleIcon.svg";
import circuitboard from "./circuitboard.svg";
import circuitboardWhite from "./circuitboardWhite.svg";

//Component Imports
import Input from "../../../Components/Input/input.js";

class Login extends Component {
  state = {
    isLogin: true,
    signupEmail: null,
    signupPassword: null,
    loginEmail: null,
    loginPassword: null
  };

  render() {
    const {
      isLogin,
      signupEmail,
      signupPassword,
      loginEmail,
      loginPassword
    } = this.state;
    const { loginWithGoogle, auth, signUp, login, clearLoginError } = this.props;
    console.log("auth", auth);
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
              label="Email"
              type="email"
              onChange={email => {this.setState({ loginEmail: email })}}
              handleSubmit={(e) => [e.preventDefault(), login(loginEmail, loginPassword)]}
              error={auth.loginError !== null}
              clearError={clearLoginError}
            />
            <div className='errorTextInputWrapper'>
              <Input
                label="Password"
                type="password"
                onChange={password => this.setState({ loginPassword: password })}
                handleSubmit={(e) => [e.preventDefault(), login(loginEmail, loginPassword)]}
                error={auth.loginError !== null}
                helperText={auth.loginError !== null ? auth.loginError : null}
                clearError={clearLoginError}
              />
            </div>
            <GradientButton
              onClick={() => login(loginEmail, loginPassword)}
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
              handleSubmit={(e) => [e.preventDefault(), signUp(signupEmail, signupPassword)]}
            />
            <Input
              label="Password"
              type="password"
              onChange={password => this.setState({ signupPassword: password })}
              label="Password"
              handleSubmit={(e) => [e.preventDefault(), signUp(signupEmail, signupPassword)]}
            />
            <GradientButton
              style={{ marginTop: "40px" }}
              onClick={() => signUp(signupEmail, signupPassword)}
              variant="contained"
              color="purple"
            >
              Sign Up
            </GradientButton>
          </div>
          <img src={circuitboardWhite} className="topLeftCircuitBoardWhite" alt="topRightCircuitBoardWhite" />
          <img src={circuitboardWhite} className="botRightCircuitBoardWhite" alt="topRightCircuitBoardWhite" />
        </div>

        <div className="innerBox fakeInnerBox">
          <img src={circuitboard} className="topLeftCircuitBoard" alt="topRightCircuitBoardWhite" />
          <img src={circuitboard} className="botRightCircuitBoard" alt="topRightCircuitBoardWhite" />
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
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
