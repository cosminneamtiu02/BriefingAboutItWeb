
var mapData = JSON.parse(localStorage.getItem('pagingData'));

var titles = mapData.titles;
var paragraphs_used = mapData.paragraphs_used;
var used_images = mapData.used_images;

console.log(titles);
console.log(paragraphs_used);
console.log(used_images);

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

function generateParagraphHTML(text) {
    return "<pre>" + text + "</pre>"
}

function generateImageHTML(bitstring) {
    const base64Data = btoa(bitstring); // Convert bitstring to base64
    const imageSrc = `data:image/png;base64,${base64Data}`; // Create data URL
    
    // Return HTML string for the image
    return `<img src="${imageSrc}" alt="Image">`;
}

console.log(generateTitleHTML("h1", "plm"));
console.log(generateParagraphHTML("plm"));
