import { firestore } from "./firebase";

var mapData = JSON.parse(localStorage.getItem('pagingData'));

var titles = mapData.titles;
var paragraphs_used = mapData.paragraphs_used;
var used_images = mapData.used_images;

console.log(titles);
console.log(paragraphs_used);
console.log(used_images);

var user = localStorage.getItem("email");

var articleID = localStorage.getItem("articleID");

var titlesHTMLasText = processTitles(titles);

const docRef = firestore.collection('Users').doc(user).collection('Articles').doc(articleID);

// Function to allow dropping elements
function allowDrop(event) {
  event.preventDefault();
}

// Function to initiate the drag event
function drag(event) {
  event.dataTransfer.setData("text", event.target.id);
}

// Function to handle dropping elements and update the order
function drop(event) {
  event.preventDefault();
  var data = event.dataTransfer.getData("text");
  var target = event.target;

  // If the target element is a child of the box, set the target to the box itself
  if (target.className !== "box") {
    target = target.closest(".box");
  }

  // Insert the dragged element before or after the target element
  if (target) {
    if (event.clientY < target.getBoundingClientRect().top + target.offsetHeight / 2) {
      target.parentNode.insertBefore(document.getElementById(data), target);
    } else {
      target.parentNode.insertBefore(document.getElementById(data), target.nextSibling);
    }
  }
}

// Function to retrieve the current order of elements
function getOrder() {
  var listbox = document.getElementById("listbox");
  var boxElements = listbox.getElementsByClassName("box");
  var order = [];

  for (var i = 0; i < boxElements.length; i++) {
    order.push(boxElements[i].id);
  }

  console.log(order);
}

function addElements(list) {
  var listbox = document.getElementById("listbox");

  for (var i = 0; i < list.length; i++) {
    var newBox = document.createElement("div");
    newBox.className = "box";
    newBox.id = "box" + i; // Set a unique ID for each box element
    newBox.draggable = true; // Make the box element draggable
    newBox.addEventListener("dragstart", drag); // Add drag event listener

    newBox.innerHTML = list[i];

    listbox.appendChild(newBox);
  }
}

addElements(titlesHTMLasText);

console.log(titlesHTMLasText);

processParagraphs(docRef, paragraphs_used)
  .then((paragraphsHTMLasText) => {
    console.log(paragraphsHTMLasText);
    addElements(paragraphsHTMLasText);
  })
  .catch((error) => {
    console.error('Error processing paragraphs:', error);
  });

  processImages(docRef, used_images)
  .then((imagesHTMLasText) => {
    console.log(imagesHTMLasText);
    addElements(imagesHTMLasText);
  })
  .catch((error) => {
    console.error('Error processing paragraphs:', error);
  });

document.getElementById('goBackToPartsSelecction').addEventListener('click', () => {
    // Redirect to the home page
    window.location.href = 'article_parts_selection.html';
});

document.getElementById('generateArticle').addEventListener('click', () => {
    // Redirect to the home page
    localStorage.setItem('pagingData', JSON.stringify([]));
    window.location.href = 'home.html';
});

function generateTitleHTML(header, title) {
    return "<" + header + ">" + title + "</" + header + ">";
}

function processTitles(titlesList) {
    return titlesList.map(item => generateTitleHTML(item.header, item.titleText));
}

function generateParagraphHTML(text) {
    return "<pre>" + text + "</pre>";
}

function processParagraphs(docRef, paragraphIds) {
    return new Promise((resolve, reject) => {
        try {
            const modifiedParagraphTextList = [];

            docRef.get().then((docSnapshot) => {
                const data = docSnapshot.data();

                if (!data || !data.paragraphs || !Array.isArray(data.paragraphs)) {
                    console.log('Invalid data structure or missing "paragraphs" field.');
                    resolve(modifiedParagraphTextList); // Resolve with an empty array
                    return;
                }

                const paragraphs = data.paragraphs;

                paragraphs.forEach((paragraph) => {
                    if (
                        paragraph.paragraphId &&
                        paragraphIds.includes(paragraph.paragraphId) &&
                        paragraph.paragraphText
                    ) {
                        const modifiedParagraphText = generateParagraphHTML(paragraph.paragraphText);
                        modifiedParagraphTextList.push(modifiedParagraphText);
                    }
                });
                resolve(modifiedParagraphTextList); // Resolve with the modified paragraph texts
            }).catch((error) => {
                console.error('Error retrieving document:', error);
                reject(error);
            });
        } catch (error) {
            console.error('Error applying function to paragraphs:', error);
            reject(error);
        }
    });
}

function processImages(docRef, imagesList) {
    return new Promise((resolve, reject) => {
        try {
            const modifiedImageHTMLList = [];

            docRef.get().then((docSnapshot) => {
                const data = docSnapshot.data();

                if (!data || !data.images || !Array.isArray(data.images)) {
                    console.log('Invalid data structure or missing "images" field.');
                    resolve(modifiedImageHTMLList); // Resolve with an empty array
                    return;
                }

                const images = data.images;
                
                images.forEach((image) => {
                  imagesList.forEach((imgMap) => {
                    if(image.id === imgMap.imageID){
                      if(imgMap.type === "blurred"){
                        modifiedImageHTMLList.push(generateImageHTML(image.imageBlurred));
                      }
                      if(imgMap.type === "unblurred"){
                        modifiedImageHTMLList.push(generateImageHTML(image.photo));
                      }
                    }
                  });
                });

                resolve(modifiedImageHTMLList); // Resolve with the modified image HTML list
            }).catch((error) => {
                console.error('Error retrieving document:', error);
                reject(error);
            });
        } catch (error) {
            console.error('Error applying function to images:', error);
            reject(error);
        }
    });
}

function generateImageHTML(bitstring) {
  var imageHTML = `
  <img id="image" draggable="false" src="data:image/png;base64,${bitstring}" alt="Image">
  `;
  return imageHTML;
}
