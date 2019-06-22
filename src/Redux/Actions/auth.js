import firebase from "firebase";
import fire from "../../fire";
import { AUTH_ERRORS, AUTH_ERROR_MESSAGES } from "../../constants.js";

/////////////////////
///// FIREBASE /////
/////////////////////

// **  Initializers **
// Initializers are usually set on componentDidMount, they only need to be set once, and will
// automatically update with a action dispatch whenever there is a change in that data
// in firebase. For example, getMessages is initialized, and calls updateMessages whenever
// there is a change in data.

export const authListener = () => dispatch => {
  fire.auth().onAuthStateChanged(user => {
    if (user) {
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: user
      });
    } else {
      dispatch({
        type: "LOGOUT"
      });
    }
  });
};

// **  Firebase Actions - One-way firebase calls without any dispatch's directly triggered**

export const logout = () => dispatch => {
  fire.auth().signOut();
};

/////////////////////////////
///// Redux Actions /////////
/////////////////////////////

export const loginWithGoogle = () => dispatch => {
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  dispatch({
    type: "LOGIN_WITH_GOOGLE_REQUEST"
  });
  fire
    .auth()
    .signInWithPopup(googleProvider)
    .then()
    .catch(error => {
      dispatch({
        type: "LOGIN_WITH_GOOGLE_FAIL",
        payload: error
      });
    });
};

export const signUp = (email, password) => dispatch => {
  dispatch({
    type: "SIGNUP_REQUEST"
  });
  fire
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then()
    .catch(error => {
      console.log('SIGNUP ERROR', error);
      dispatch({
        type: "SIGN_UP_FAIL",
        payload: AUTH_ERROR_MESSAGES[error.code]
      });
    });
};

export const login = (email, password) => dispatch => {
  dispatch({
    type: "LOGIN_REQUEST"
  });
  fire
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then()
    .catch(error => {
      dispatch({
        type: "LOGIN_FAIL",
        payload: AUTH_ERROR_MESSAGES[error.code]
      });
    });
};

export const clearLoginError = () => dispatch => {
  dispatch({
    type: "CLEAR_LOGIN_ERROR",
  });
};

export const clearSignUpError = () => dispatch => {
  dispatch({
    type: "CLEAR_SIGN_UP_ERROR",
  });
};
