import firebase from "firebase/app";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyD2_zIst25_dYkUSbVRXo8OX1mFJdwN8Kc",
  authDomain: "movies101-iqr.firebaseapp.com",
  databaseURL: "https://movies101-iqr.firebaseio.com",
  projectId: "movies101-iqr",
  storageBucket: "movies101-iqr.appspot.com",
  messagingSenderId: "257729124995",
  appId: "1:257729124995:web:4eba8bed4e44eb9e"
};

firebase.initializeApp(config);
const db = firebase.firestore();

export default db;
