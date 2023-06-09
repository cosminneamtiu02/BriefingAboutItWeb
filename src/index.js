import login from './login';

document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password, 
        () => {      
            // Redirect to the home page
            window.location.href = 'home.html';
          });
  });