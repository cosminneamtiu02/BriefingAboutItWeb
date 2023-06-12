
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