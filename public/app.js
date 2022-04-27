const resultsBtn = document.querySelector('#results');
const feedDiv = document.querySelector('#feed');

resultsBtn.addEventListener('click', displayResults);

async function displayResults() {
    const response = await fetch('http://localhost:3000/results');
    const data = await response.json();
    //  console.log(data);
    for (d of data) {
        const item = document.createElement('article');
        item.innerHTML = `
        <img src="${d.img}" alt="${d.title}">
        <h2><a href="${d.url}">${d.title}</a></h2>
        `;
        feedDiv.appendChild(item);
    }
}
