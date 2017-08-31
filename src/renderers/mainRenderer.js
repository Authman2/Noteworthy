const fs = require('fs');
const ipc = require('electron').ipcRenderer;
const global = require('electron').remote.getGlobal('sharedObject');
const body = document.getElementById('root');


/**
Checks if a value exists for a given element.
*/
const valueExists = (element) => {
    if(element === undefined || element === null) return false;
    if(element === '' || element === ' ') return false;
    return true;
}





/**********************
*                     *
*     RENDER STYLE    *
*                     *
***********************/

const stylesComponent = () => { 
    return '<link rel="stylesheet" type="text/css" href="src/styles/MPB.css">'
    + '<link rel="stylesheet" type="text/css" href="src/styles/home.css">'
    + '<link rel="stylesheet" type="text/css" href="src/styles/signup.css">'
    + '<link rel="stylesheet" type="text/css" href="src/styles/NotebooksSlider.css">';
}






/**********************
*                     *
*     HOME SCRIPT     *
*                     *
***********************/

const defineHomeScript = () => {
    const mpb = document.getElementById('mpb');
    const notebookSlider = document.getElementById('notebookSlider');

    // Whether or not the notebook slider is open.
    var sliderOpen = false;

    
    
    // Toggle the notebook slider.
    mpb.onclick = function() {
        if(sliderOpen) {
            mpb.style.bottom = '30px';
            notebookSlider.style.bottom = '-150px';
            sliderOpen = false;
        } else {
            mpb.style.bottom = '180px';
            notebookSlider.style.bottom = '0px';
            sliderOpen = true;
        }
    }
}



/**********************
*                     *
*    SIGNUP SCRIPT    *
*                     *
***********************/

const defineSignupScript = () => {
    const firstNameField = document.getElementById('firstNameField_signup');
    const lastNameField = document.getElementById('lastNameField_signup');
    const emailField = document.getElementById('emailField_signup');
    const passwordField = document.getElementById('passwordField_signup');
    const passwordConfirmField = document.getElementById('passwordConfirmField_signup');

    const createAccountButton = document.getElementById('createAccountButton');


    /**
    Handles creating an account on Noteworthy.
    */
    createAccountButton.onclick = function() {
        const firstName = firstNameField.value;
        const lastName = lastNameField.value;
        const email = emailField.value;
        const password = passwordField.value;
        const confirmPass = passwordConfirmField.value;

        // Make sure there is a value for each field.
        if( valueExists(firstName) && valueExists(lastName) && valueExists(email) && valueExists(password)
            && valueExists(confirmPass)) {

        } else {
            if(!valueExists(firstName)) { firstNameField.style.border = '2px red solid'; }
            if(!valueExists(lastName)) { lastNameField.style.border = '2px red solid'; }
            if(!valueExists(email)) { emailField.style.border = '2px red solid'; }
            if(!valueExists(password)) { passwordField.style.border = '2px red solid'; }
            if(!valueExists(confirmPass)) { passwordConfirmField.style.border = '2px red solid'; }
        }
    }
}






/**********************
*                     *
*     LOAD CONTENT    *
*                     *
***********************/

// Set the current page to Home initially, then send a message to the main process to render that page, which
// should just come right back here in the reply area to setup the data from the global attributes.
global.currentPage = global.homePage;
ipc.send('changeCurrentPage-send', global.currentPage);
ipc.on('changeCurrentPage-reply', (event, page, scriptType) => {
    body.innerHTML = global.reloadContent(page, stylesComponent());
    switch(scriptType) {
        case 'home': global.defineVariables('home', (page) => { defineHomeScript(); }); break;
        case 'signup': global.defineVariables('signup', (page) => { defineSignupScript(); }); break;
    }
});