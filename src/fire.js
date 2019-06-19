import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDI0YIl0T3beSZ9esIlRL6uMn4XwrfHK6o",
  authDomain: "servo-53090.firebaseapp.com",
  databaseURL: "https://servo-53090.firebaseio.com",
  projectId: "servo-53090",
  storageBucket: "",
  messagingSenderId: "281208039125",
  appId: "1:281208039125:web:971d60793277db45"
};

const fire = firebase.initializeApp(firebaseConfig);

export default fire;
