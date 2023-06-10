
document.getElementById('returnHomeButton').addEventListener('click', () => {

    // Redirect to the home page
    window.location.href = 'home.html';
  });




// Get the value of the variable from the URL
var urlParams = new URLSearchParams(window.location.search);
var articleId = urlParams.get('articleId');

// Use the variable value as needed
console.log(articleId); // Output: value