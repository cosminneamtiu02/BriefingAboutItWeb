import { auth } from './firebase';
import Swal from 'sweetalert2';

const login = (email, password, successCallback) => {
  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      console.log('User is signed in:', email);
      localStorage.setItem('email', email);
  
      if (typeof successCallback === 'function') {
        successCallback();
      }
    })
    .catch((error) => {
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
