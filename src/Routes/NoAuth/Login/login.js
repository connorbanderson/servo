import React, { Component } from "react";
import { connect } from "react-redux";
import { signUp, login, loginWithGoogle } from "../../../Redux/Actions/auth";
import { makeStyles } from '@material-ui/styles';
import MyButton from "../../../Components/Button/Button.js"

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
    const { loginWithGoogle, auth, signUp, login } = this.props;
    console.log('userSignup', loginEmail, loginPassword);
    return (
      <section className="loginWrapper">
        <div className="innerBox">
          <div className="parrotWrapper">
            <div className="parrotShield" />
            <img src={logo} className="parrot noselect" alt="logo" />
          </div>

          <div className={isLogin ? "slider sliderLogin" : "slider sliderSignup"}>
            <div
              style={{ marginTop: "250px" }}
              onClick={() => this.setState({ isLogin: !isLogin })}
              className="buttonSecondary"
            >
              <span>{!isLogin ? "Log In" : "Sign Up"}</span>
            </div>
          </div>

          <div className={!isLogin ? "leftBoxTextSlideIn boxText" : "leftBoxText boxText"}>
            <span className="largeText">Welcome Back!</span>
            <span className="mediumText">To keep connected with us please login with your personal info</span>
          </div>

          <div className={isLogin ? "rightBoxTextSlideIn boxText" : "rightBoxText boxText"}>
            <span className="largeText">Hello, Friend!</span>
            <span className="mediumText">Enter your login credentials to check out your portfolio</span>
          </div>

          <div className={isLogin ? "signIn signInActive" : "signIn signInInactive"}>
            <span className="largeText gradientText">Sign in to Servo</span>
            <div className="flex">
              <div onClick={()=>loginWithGoogle()} className="socialWrapper flex">
                <img
                  src={googleIcon}
                  alt="googleLoginIcon"
                  style={{ height: "70%", width: "70%" }}
                />
              </div>
              <div className="socialWrapper flex">
                <i className="fab fa-facebook-f" />
              </div>
              <div className="socialWrapper flex">
                <i className="fab fa-linkedin-in" />
              </div>
            </div>
            <div className="smallText">or use your email account</div>
            <Input type="email" type="email" onChange={(email)=>this.setState({loginEmail: email})} label="Email" />
            <Input type="password" type="password" onChange={(password)=>this.setState({loginPassword: password})} label="Password" />
            <MyButton onClick={()=>login(loginEmail, loginPassword)} variant="contained" color="purple" >
              Log In
            </MyButton>
            <span className="forgotText">Forgot your Password?</span>
          </div>

          <div className={!isLogin ? "signUp signUpActive" : "signUp signUpInactive"}>
            <span className="largeText gradientText">Sign up to Servo</span>
            <div className="flex">
            <div onClick={()=>loginWithGoogle()} className="socialWrapper flex">
              <img
                src={googleIcon}
                alt="googleLoginIcon"
                style={{ height: "70%", width: "70%" }}
              />
            </div>
              <div className="socialWrapper flex">
                <i class="fab fa-facebook-f" />
              </div>
              <div className="socialWrapper flex">
                <i class="fab fa-linkedin-in" />
              </div>
            </div>
            <div className="smallText">or use your email account</div>
            <Input type="email" onChange={(email)=>this.setState({signupEmail: email})} label="Email" />
            <Input type="password" onChange={(password)=>this.setState({signupPassword: password})} label="Password" />
            <div onClick={()=>signUp(signupEmail, signupPassword)} className="buttonPrimary">
              <span>Sign Up</span>
            </div>
          </div>

          <img src={circleWhite} className="circleWhite" alt="logo" />
          <img src={triangleWhite} className="triangleWhite" alt="logo" />
        </div>

        <div className="innerBox fakeInnerBox">
          <img src={circle} className="circle" alt="logo" />
          <img src={triangle} className="triangle" alt="logo" />
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
  login: (email, password) => dispatch(login(email, password))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
