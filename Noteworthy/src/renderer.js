const fs = require('fs');
const body = document.getElementById('root');


// Create the different pages.
const home = fs.readFileSync('src/pages/home.html','utf8');

// Load some components.
const MPB = fs.readFileSync('src/components/MPB.html', 'utf8');





// Create the rendering components.
const homePage = () => { return '' + home + MPB; }
const currentPage = () => { return homePage(); }
const stylesComponent = () => { 
    return '<link rel="stylesheet" type="text/css" href="src/styles/MPB.css">'
    + '<link rel="stylesheet" type="text/css" href="src/styles/home.css">';
}

// Render the current page inside of a main div.
body.innerHTML = stylesComponent() + '<div>' + currentPage() + '</div>';