// src/firebase.js
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDhtOXyBb1nY6X0WRSZCM901YFfF4_9FNY",
  authDomain: "briefingaboutit.firebaseapp.com",
  projectId: "briefingaboutit",
  storageBucket: "briefingaboutit.appspot.com",
  messagingSenderId: "890931101169",
  appId: "1:890931101169:web:3d9dec393b4f6d36b69850",
  measurementId: "G-JKSLGQCM9B"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  
export default firebase;
