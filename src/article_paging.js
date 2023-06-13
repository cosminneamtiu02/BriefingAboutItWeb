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
    console.log(downloadHtmlFile(generateHtmlWithBodyContent(removeCharacters(retrieveBoxContent()))));
});

function downloadHtmlFile(content) {
  const element = document.createElement('a');
  const file = new Blob([content], { type: 'text/html' });
  element.href = URL.createObjectURL(file);
  element.download = "undefined.html";
  element.click();
}

function retrieveBoxContent() {
  var boxes = document.querySelectorAll('.box');
  var boxContent = [];

  // Iterate over each box and retrieve its inner HTML
  boxes.forEach(function (box) {
    boxContent.push(box.innerHTML);
  });

  return boxContent;
}

function removeCharacters(strings) {
  var regex = /[\n\\]/g;
  var result = [];

  for (var i = 0; i < strings.length; i++) {
    var modifiedString = strings[i].replace(regex, '');
    result.push(modifiedString);
  }

  return result;
}

function generateHtmlWithBodyContent(contentArray) {
  // Opening HTML structure
  let htmlTemplate = `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>HTML Body Content</title>
    </head>
    <body>
    `;

  // Concatenating content with new lines
  const bodyContent = contentArray.join('\n');

  // Closing HTML structure
  htmlTemplate += bodyContent + `
    </body>
    </html>
    `;

  return htmlTemplate;
}

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
