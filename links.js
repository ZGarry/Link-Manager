// 无数据时设置默认数据
if (localStorage.getItem('links') === null) {
    var defaultLinks = [
        { "title": "Google", "url": "https://www.google.com", "category": "Search Engine" },
        { "title": "Bing", "url": "https://www.bing.com", "category": "Search Engine" },
        { "title": "StackOverflow", "url": "https://stackoverflow.com", "category": "Programming" },
        { "title": "GitHub", "url": "https://github.com", "category": "Programming" },
        { "title": "Python", "url": "https://www.python.org", "category": "Programming" },
        { "title": "JavaScript", "url": "https://www.javascript.com", "category": "Programming" },
    ];

    // 将默认链接存储到localStorage
    localStorage.setItem('links', JSON.stringify(defaultLinks));
}

// 从此处开始你的其他代码...
var links = JSON.parse(localStorage.getItem('links')) || [];


document.getElementById('add-link-form').addEventListener('submit', function (event) {
    event.preventDefault();

    var title = document.getElementById('title').value;
    var url = document.getElementById('url').value;
    var category = document.getElementById('category').value;

    links.push({ title: title, url: url, category: category });

    localStorage.setItem('links', JSON.stringify(links));  // Save to local storage

    displayLinks();
});

document.getElementById('export-links').addEventListener('click', function () {
    var blob = new Blob([JSON.stringify(links)], { type: "application/json" });
    var url = URL.createObjectURL(blob);

    var a = document.createElement('a');
    a.download = 'links.json';
    a.href = url;
    a.click();
});

document.getElementById('import-links').addEventListener('change', function (event) {
    var file = event.target.files[0];

    var reader = new FileReader();
    reader.onload = function (e) {
        links = JSON.parse(e.target.result);
        localStorage.setItem('links', JSON.stringify(links));  // Save to local storage
        displayLinks();
    };
    reader.readAsText(file);
});

document.getElementById('toggle-settings').addEventListener('click', function () {
    var settings = document.getElementById('advanced-settings');
    if (settings.style.display === 'none' || settings.style.display === '') {
        settings.style.display = 'block';
        console.log('1');
    } else {
        settings.style.display = 'none';
        console.log('2');
    }
});

function displayLinks() {
    var linksDiv = document.getElementById('links');
    linksDiv.innerHTML = '';  // Clear the div

    var categories = [...new Set(links.map(link => link.category))];  // Get unique categories

    categories.forEach(category => {
        var categoryDiv = document.createElement('div');
        var categoryTitle = document.createElement('h2');
        categoryTitle.textContent = category;
        categoryDiv.appendChild(categoryTitle);

        var gridContainer = document.createElement('div');
        gridContainer.className = 'grid-container';

        links.filter(link => link.category === category).forEach((link, index) => {
            var gridItem = document.createElement('div');
            gridItem.className = 'grid-item';
            var linkElement = document.createElement('a');
            linkElement.href = link.url;
            linkElement.textContent = link.title;
            linkElement.target = '_blank';
            gridItem.appendChild(linkElement);

            var deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', function () {
                links.splice(index, 1);  // Remove the link from the array
                localStorage.setItem('links', JSON.stringify(links));  // Save to local storage
                displayLinks();  // Update the display
            });
            gridItem.appendChild(deleteButton);

            gridContainer.appendChild(gridItem);
        });

        categoryDiv.appendChild(gridContainer);
        linksDiv.appendChild(categoryDiv);
    });
}

displayLinks();  // Display links on page load