import { firestore } from "./firebase";

document.getElementById('returnHomeButton').addEventListener('click', () => {
  // Redirect to the home page
  window.location.href = 'home.html';
});

// Get the value of the variable from the URL
var urlParams = new URLSearchParams(window.location.search);
var articleId = urlParams.get('articleId');

// Use the variable value as needed
console.log(articleId); // Output: value

function getArticles() {
  var articlesList = document.getElementById("articles-list");
  var userId = localStorage.getItem("email");

  firestore.collection("Users").doc(userId).collection("Articles").doc(articleId).get().then(function(doc) {
    if (doc.exists) {
      var article = doc.data();
      var paragraphs = article.paragraphs;

      paragraphs.forEach(function(paragraph) {
        var paragraphId = paragraph.paragraphId;
        var paragraphDescription = paragraph.paragraphDescription;
        var paragraphText = paragraph.paragraphText;
        var paragraphTitle = paragraph.paragraphTitle.titleText;

        var listItem = document.createElement("li");
        listItem.style.backgroundColor = "#dddddd";
        listItem.style.padding = "10px";
        listItem.style.marginBottom = "10px";
        listItem.style.borderRadius = "5px";
        listItem.style.cursor = "pointer";
        listItem.style.listStyleType = "none";
        listItem.style.overflowWrap = "break-word";
        listItem.style.whiteSpace = "normal";
        listItem.style.textOverflow = "ellipsis";
        listItem.style.maxWidth = "100%";
        listItem.style.marginRight = "15px";

        listItem.addEventListener("mouseenter", function() {
            listItem.style.backgroundColor = "#f2f2f2";
        });

        listItem.addEventListener("mouseleave", function() {
            listItem.style.backgroundColor = "#d9d9d9";

        });
        
        listItem.classList.add("article-item");

        var description = document.createElement("p");
        description.classList.add("description");
        description.innerHTML = paragraphDescription;

        var displayBtn = document.createElement("button");
        displayBtn.classList.add("button-type");
        displayBtn.innerHTML = "Display Paragraph";
        displayBtn.addEventListener("click", function() {
            showParagraphPopup(paragraphTitle, paragraphText);
        });

        // Apply the button styling
        displayBtn.style.backgroundColor = "#4CAF50";
        displayBtn.style.borderRadius = "20px";
        displayBtn.style.color = "black";
        displayBtn.style.textAlign = "center";
        displayBtn.style.textDecoration = "none";
        displayBtn.style.fontSize = "16px";

        var buttonRow = document.createElement("div");
        buttonRow.classList.add("row");

        var radioContainer = document.createElement("div");
        radioContainer.classList.add("radio-container");
        
        var radioLabel = document.createElement("label");
        radioLabel.classList.add("radiobutton");
        radioLabel.innerHTML = "Use title: ";
        
        var yesRadio = document.createElement("input");
        yesRadio.type = "radio";
        yesRadio.name = "use-title-" + paragraphId;
        yesRadio.value = "yes";
        yesRadio.addEventListener("change", function(event) {
          if (event.target.checked) {
            console.log("Using title");
          }
        });
        radioLabel.appendChild(yesRadio);
        radioLabel.appendChild(document.createTextNode(" Yes"));
        
        var noRadio = document.createElement("input");
        noRadio.type = "radio";
        noRadio.name = "use-title-" + paragraphId;
        noRadio.value = "no";
        noRadio.checked = true; // Set "No" as the default option
        noRadio.addEventListener("change", function(event) {
          if (event.target.checked) {
            console.log("Not using title");
          }
        });
        radioLabel.appendChild(noRadio);
        radioLabel.appendChild(document.createTextNode(" No"));
        
        radioContainer.appendChild(radioLabel);


        buttonRow.appendChild(displayBtn);
        buttonRow.appendChild(radioContainer);

        var checkboxContainer = document.createElement("div");
        checkboxContainer.classList.add("checkbox-container");

        var checkboxLabel = document.createElement("label");
        checkboxLabel.innerHTML = "Use paragraph?";

        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("checkbox");
        checkbox.addEventListener("change", function() {
          if (checkbox.checked) {
            saveParagraphId(paragraphId);
          } else {
            removeParagraphId(paragraphId);
          }
        });

        checkboxLabel.appendChild(checkbox);
        checkboxContainer.appendChild(checkboxLabel);
        buttonRow.appendChild(checkboxContainer);

        listItem.appendChild(description);
        listItem.appendChild(buttonRow);
        articlesList.appendChild(listItem);
      });
    } else {
      console.log("No article found");
    }
  }).catch(function(error) {
    console.log("Error retrieving article:", error);
  });
}

function showParagraphPopup(title, text) {
  var popup = document.getElementById("paragraph-popup");
  var closeButton = document.getElementById("close-button");
  var popupTitle = document.getElementById("paragraph-title");
  var popupText = document.getElementById("paragraph-text");

  popupTitle.innerHTML = title;
  popupText.innerHTML = text;
  popup.style.display = "block";

  closeButton.addEventListener("click", function() {
    popup.style.display = "none";
  });
}

function saveParagraphId(paragraphId) {
  console.log("Paragraph ID saved:", paragraphId);
}

function removeParagraphId(paragraphId) {
  console.log("Paragraph ID removed:", paragraphId);
}

getArticles();
