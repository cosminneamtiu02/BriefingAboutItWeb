import { firestore } from "./firebase";

document.getElementById('logoutButton').addEventListener('click', () => {
    // Clear the stored email from localStorage
    localStorage.removeItem('email');

    // Redirect to the login page
    window.location.href = 'index.html';
  });

const userId = localStorage.getItem("email");
const articlesRef = firestore.collection("Users").doc(userId).collection("Articles");

    // Retrieve the documents from the "Articles" collection
articlesRef.get().then((querySnapshot) => {
      const listView = document.getElementById("listView");

      // Clear the existing content of the list view
      listView.innerHTML = "";

      // Create and append list items for each document
      querySnapshot.forEach((doc) => {
        const documentId = doc.id;
        const titleText = doc.data().title.titleText;

        const listItem = document.createElement("li");
        listItem.classList.add("list-item");
        listItem.textContent = titleText;
        listItem.addEventListener("click", () => {
          // Handle the click event for each list item
          console.log("Clicked on document ID:", documentId);

          // Variable value to pass
          var variableValue = documentId;

          // Construct the URL with the variable value
          var nextUrl = "article_parts_selection.html?articleId=" + encodeURIComponent(variableValue);

          // Redirect to the next URL
          window.location.href = nextUrl;

        });

        listView.appendChild(listItem);
      });
    })
.catch((error) => {
      console.error("Error retrieving documents:", error);
});