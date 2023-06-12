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

function getParagraphs() {
  var paragraphsList = document.getElementById("paragraph-list");
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
        displayBtn.style.color = "white";
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
        paragraphsList.appendChild(listItem);
      });

      var images = article.images;
      var imagesList = document.getElementById("images-list");
      
      images.forEach(function (image) {
        var imageName = image.imageName;
        var imageid = image.id;
        var blurredPhoto = image.blurredPhotoAsBitmap;
        var unblurredImage = image.photo;
      
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
      
        listItem.addEventListener("mouseenter", function () {
          listItem.style.backgroundColor = "#f2f2f2";
        });
      
        listItem.addEventListener("mouseleave", function () {
          listItem.style.backgroundColor = "#d9d9d9";
        });
      
        listItem.classList.add("article-item");
      
        var description = document.createElement("p");
        description.classList.add("description");
        description.innerHTML = imageName;
      
        var displayBtn = document.createElement("button");
        displayBtn.classList.add("button-type");
        displayBtn.innerHTML = "See images";
        displayBtn.addEventListener("click", function () {
          showImagePopup(unblurredImage, blurredPhoto);
        });
      
        // Apply the button styling
        displayBtn.style.backgroundColor = "#4CAF50";
        displayBtn.style.borderRadius = "20px";
        displayBtn.style.color = "white";
        displayBtn.style.textAlign = "center";
        displayBtn.style.textDecoration = "none";
        displayBtn.style.fontSize = "16px";
      
        var buttonRow = document.createElement("div");
        buttonRow.classList.add("row");
      
        var radioContainer = document.createElement("div");
        radioContainer.classList.add("radio-container");
      
        var radioLabel = document.createElement("label");
        radioLabel.classList.add("radiobutton");
        radioLabel.innerHTML = "Use image? ";
        
        if(unblurredImage){
            var useUnblurred = document.createElement("input");
            useUnblurred.type = "radio";
            useUnblurred.name = "use-image-" + imageid; // Use unique names for each group
            useUnblurred.value = "Use unblurred";
            useUnblurred.addEventListener("change", function (event) {
            if (event.target.checked) {
                console.log("Use image unblurred");
            }
            });
        
        radioLabel.appendChild(useUnblurred);
        radioLabel.appendChild(document.createTextNode(" Use unblurred"));
        }

        if(blurredPhoto){
            var useBlurred = document.createElement("input");
            useBlurred.type = "radio";
            useBlurred.name = "use-image-" + imageid; // Use unique names for each group
            useBlurred.value = "Use blurred";
            useBlurred.addEventListener("change", function (event) {
            if (event.target.checked) {
                console.log("Use image blurred");
            }
            });
        
            radioLabel.appendChild(useBlurred);
            radioLabel.appendChild(document.createTextNode(" Use blurred"));
        
        }

        var useNoImage = document.createElement("input");
        useNoImage.type = "radio";
        useNoImage.name = "use-image-" + imageid; // Use unique names for each group
        useNoImage.value = "Use no image";
        useNoImage.checked = true;
        useNoImage.addEventListener("change", function (event) {
          if (event.target.checked) {
            console.log("Use no image");
          }
        });
      
        radioLabel.appendChild(useNoImage);
        radioLabel.appendChild(document.createTextNode(" Use no image"));
      
        radioContainer.appendChild(radioLabel);
      
        buttonRow.appendChild(displayBtn);
        buttonRow.appendChild(radioContainer);
      
        listItem.appendChild(description);
        listItem.appendChild(buttonRow);
        imagesList.appendChild(listItem);
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

function showImagePopup(unblurredPhoto, blurredPhotoAsBitmap) {
    var popup = document.createElement("div");
    popup.id = "image-popup";
    popup.style.display = "none";
    popup.style.position = "fixed";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.padding = "20px";
    popup.style.backgroundColor = "#fff";
    popup.style.border = "1px solid #ccc";
    popup.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.2)";
    popup.style.zIndex = "9999";
    popup.style.maxWidth = "80%";
    popup.style.overflowY = "auto";
    popup.style.maxHeight = "80%"; // Add maxHeight property
  
    var closeButton = document.createElement("button");
    closeButton.id = "close-button";
    closeButton.innerHTML = "&times;";
    closeButton.style.position = "absolute";
    closeButton.style.top = "10px";
    closeButton.style.right = "10px";
    closeButton.style.width = "30px";
    closeButton.style.height = "30px";
    closeButton.style.borderRadius = "50%";
    closeButton.style.border = "none";
    closeButton.style.backgroundColor = "#ccc";
    closeButton.style.color = "#fff";
    closeButton.style.fontSize = "20px";
    closeButton.style.lineHeight = "30px";
    closeButton.style.textAlign = "center";
    closeButton.style.cursor = "pointer";
  
    var title = document.createElement("h2");
    title.textContent = "Image Preview";
  
    var imageContainer = document.createElement("div");
    imageContainer.classList.add("image-container");
    imageContainer.style.display = "flex";
    imageContainer.style.justifyContent = "space-between";
  
    if (unblurredPhoto) {
      var unblurredImageItem = document.createElement("div");
      unblurredImageItem.classList.add("image-item");
      var unblurredImageLabel = document.createElement("p");
      unblurredImageLabel.textContent = "Unblurred Image:";
      var unblurredImage = document.createElement("img");
      unblurredImage.src = "data:image/png;base64," + unblurredPhoto;
      unblurredImage.alt = "Unblurred Image";
      unblurredImage.style.maxWidth = "50%"; // Adjust the width as needed
      unblurredImageItem.appendChild(unblurredImageLabel);
      unblurredImageItem.appendChild(unblurredImage);
      imageContainer.appendChild(unblurredImageItem);
    }
  
    if (blurredPhotoAsBitmap) {
      var blurredImageItem = document.createElement("div");
      blurredImageItem.classList.add("image-item");
      var blurredImageLabel = document.createElement("p");
      blurredImageLabel.textContent = "Blurred Image:";
      var blurredImage = document.createElement("img");
      blurredImage.src = "data:image/png;base64," + blurredPhotoAsBitmap;
      blurredImage.alt = "Blurred Image";
      blurredImage.style.maxWidth = "50%"; // Adjust the width as needed
      blurredImageItem.appendChild(blurredImageLabel);
      blurredImageItem.appendChild(blurredImage);
      imageContainer.appendChild(blurredImageItem);
    }
  
    if (!(blurredPhotoAsBitmap || unblurredPhoto)) {
      var blurredImageItem = document.createElement("div");
      blurredImageItem.classList.add("image-item");
      var blurredImageLabel = document.createElement("p");
      blurredImageLabel.textContent = "No images to be displayed";
      blurredImageItem.appendChild(blurredImageLabel);
      imageContainer.appendChild(blurredImageItem);
    }
  
    popup.appendChild(closeButton);
    popup.appendChild(title);
    popup.appendChild(imageContainer);
  
    document.body.appendChild(popup);
  
    // Update popup positioning on window resize
    window.addEventListener("resize", updatePopupPosition);
  
    function updatePopupPosition() {
      var popupRect = popup.getBoundingClientRect();
  
      // Check if popup exceeds the screen height
      if (popupRect.height > window.innerHeight) {
        popup.style.top = "0";
        popup.style.transform = "translate(-50%, 0)";
        popup.style.maxHeight = window.innerHeight + "px";
        imageContainer.style.maxHeight = window.innerHeight - 100 + "px";
      } else {
        popup.style.top = "50%";
        popup.style.transform = "translate(-50%, -50%)";
        popup.style.maxHeight = "80%";
        imageContainer.style.maxHeight = "";
      }
    }
  
    closeButton.addEventListener("click", function () {
      window.removeEventListener("resize", updatePopupPosition);
      document.body.removeChild(popup);
    });
  
    // Initial positioning
    updatePopupPosition();
  
    popup.style.display = "block";
  }
  

getParagraphs();