import firebase from './firebase';

const login = (email, password) => {

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Login successful
      const user = userCredential.user;
      console.log('User is signed in:', user);
    })
    .catch((error) => {
      // Handle login error
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Login error:', errorCode, errorMessage);
    });
};

export default login;