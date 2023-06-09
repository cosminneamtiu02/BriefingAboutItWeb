import firebase from './firebase';
import Swal from 'sweetalert2';

const login = (email, password, successCallback) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {

        console.log('User is signed in:', email);
        // Call the success callback if it is defined
  
        // Store email in localStorage
        localStorage.setItem('email', email);
  
        // Call the success callback if it is defined
        if (typeof successCallback === 'function') {
          successCallback();
        }
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