import firebase from './firebase';
import Swal from 'sweetalert2';

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

      Swal.fire({
        icon: 'error',
        title: 'Login Error',
        text: 'Email or Password incorrect',
      });
    });


};

export default login;