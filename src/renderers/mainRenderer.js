const fs = require('fs');
const ipc = require('electron').ipcRenderer;
const global = require('electron').remote.getGlobal('sharedObject');

const firebase = require('firebase');
const config = require('../creds/creds.json')
firebase.initializeApp(config);


/**********************
*                     *
*      VARIABLES      *
*                     *
***********************/

const body = document.getElementById('root');
const fireRef = firebase.database().ref();
const fireAuth = firebase.auth();

// Whether or not the notebook slider is open.
var sliderOpen = false;

// The notebooks (and add notebook button) that are dislayed on the notebook slider.
var notebooks = [{
    title: 'New',
    id: '',
    content: ''
}];



/**********************
*                     *
*       METHODS       *
*                     *
***********************/

/** Sets up the data in the notebook slider. */
const configureNotbookSlider = (list, titleField, noteField) => {
    for(var i = 0; i < notebooks.length; i++) {
        const notebook = notebooks[i];
        
        // Create two elements that make up each notebook on the slider.
        const imagePart = document.createElement('div');
        const titlePart = document.createElement('h3');

        // Style the notebook preview
        imagePart.style.position = 'relative';
        imagePart.style.width = '80px';
        imagePart.style.height = '90%';
        imagePart.style.margin = 'auto';
        imagePart.style.cursor = 'pointer';
        imagePart.style.textAlign = 'center';

        // The first one is always the 'add note' button.
        if(i === 0) {
            imagePart.innerHTML = '<img src=\'src/res/addNoteButton.png\' alt=\'notebookPreview\' width=\'100%\' height=\'100%\'  />';
        } else {
            imagePart.innerHTML = '<img src=\'src/res/notebookPreview.png\' alt=\'notebookPreview\' width=\'100%\' height=\'100%\'  />';
        }

        titlePart.style.textAlign = 'center';
        titlePart.style.fontSize = 20;
        titlePart.style.fontWeight = 100;
        titlePart.style.cursor = 'pointer';
        titlePart.style.fontFamily = 'Avenir';
        titlePart.innerHTML = notebook.title;

        // Create the element that gets added to the list.
        const entry = document.createElement('li');
        entry.appendChild(imagePart);
        entry.appendChild(titlePart);

        list.appendChild(entry);



        // Define the click behavior for each notebook.
        const closeSlider = () => {
            document.getElementById('mpb').style.bottom = '30px';
            document.getElementById('notebookSlider').style.bottom = '-150px';
            sliderOpen = false;
        }
        if(i === 0) {
            imagePart.onclick = () => {
                titleField.value = '';
                noteField.value = '';
                closeSlider();
            }
            titlePart.onclick = () => {
                titleField.value = '';
                noteField.value = '';
                closeSlider();
            }
        } else {
            imagePart.onclick = () => {
                titleField.value = notebook.title;
                noteField.value = notebook.content;
            }
            titlePart.onclick = () => {
                titleField.value = notebook.title;
                noteField.value = notebook.content;
            }
        }
    }
}


/** Checks if a value exists for a given element. */
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
    return '<link rel="stylesheet" type="text/css" href="src/styles/notebooksButton.css">'
    + '<link rel="stylesheet" type="text/css" href="src/styles/home.css">'
    + '<link rel="stylesheet" type="text/css" href="src/styles/signup.css">'
    + '<link rel="stylesheet" type="text/css" href="src/styles/login.css">'
    + '<link rel="stylesheet" type="text/css" href="src/styles/NotebooksSlider.css">';
}






/**********************
*                     *
*     HOME SCRIPT     *
*                     *
***********************/

const defineHomeScript = () => {
    const titleField = document.getElementById('titleArea');
    const noteField = document.getElementById('noteArea');

    const notebooksButton = document.getElementById('mpb');
    const notebookSlider = document.getElementById('notebookSlider');
    const sliderList = document.getElementById('sliderList');

    // Configure the look of the notebook slider.
    configureNotbookSlider(sliderList, titleField, noteField);
    
    
    // Toggle the notebook slider.
    notebooksButton.onclick = function() {
        if(sliderOpen) {
            notebooksButton.style.bottom = '30px';
            notebookSlider.style.bottom = '-150px';
            sliderOpen = false;
        } else {
            notebooksButton.style.bottom = '180px';
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
    const cancelButton = document.getElementById('closeSignupButton');

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

            // The object for the account data.
            const accountData = {
                "firstName": firstName,
                "lastName": lastName,
                "notes": [],
                "uid": ''
            };
            
            // Create the account.
            fireAuth.createUserWithEmailAndPassword(email, password).then( (auth) => {
                
                // Log in to the account right away.
                fireAuth.onAuthStateChanged((user) => {
                    if (user) {
                        accountData['uid'] = user.uid;
                        
                        // Save the data to the database.
                        fireRef.child('users').child(user.uid).set(accountData);
                        
                        alert('Welcome to Noteworthy, ' + firstName + "! Your account has been successfully created!");

                        changePage(global.homePage, 'home', () => { defineHomeScript() });
                    } else { return; }
                });

            }).catch( (err) => {
                alert('There was a problem creating your account: \n' + err);
            });
            
        } else {
            if(!valueExists(firstName)) { firstNameField.style.border = '2px red solid'; }
            if(!valueExists(lastName)) { lastNameField.style.border = '2px red solid'; }
            if(!valueExists(email)) { emailField.style.border = '2px red solid'; }
            if(!valueExists(password)) { passwordField.style.border = '2px red solid'; }
            if(!valueExists(confirmPass)) { passwordConfirmField.style.border = '2px red solid'; }
        }
    }



    /**
    Cancels the sign up process and goes back to the home page.
    */
    cancelButton.onclick = function() {
        changePage(global.homePage, 'home', () => { defineHomeScript() });
    }
}

/**********************
*                     *
*     LOGIN SCRIPT    *
*                     *
***********************/

const defineLoginScript = () => {
    const emailField = document.getElementById('emailField_login');
    const passwordField = document.getElementById('passwordField_login');

    const loginButton = document.getElementById('loginButton');
    const cancelButton = document.getElementById('closeLoginButton');


    cancelButton.onclick = () => {
        changePage(global.homePage, 'home', () => { defineHomeScript() });
    }
    loginButton.onclick = () => {
        const email = emailField.value;
        const password = passwordField.value;

        if(valueExists(email) && valueExists(password)) {

            fireAuth.signInWithEmailAndPassword(email, password).then( (user) => {
                fireRef.child('users').child(user.uid).once('value', (snap) => {
                    const a = {
                        firstName: snap.val().firstName,
                        lastName: snap.val().lastName,
                        uid: snap.val().uid,
                        notes: snap.val().notes ? snap.val().notes : []
                    }

                    global.currentUser = a;
                    changePage(global.homePage, 'page', () => { defineHomeScript(); });
                });

            }).catch((err) => {
                alert('There was a problem logging in. \n' + err);
            });

        } else {
            alert('Missing Credentials. Please enter all fields to login.');
        }
    }
}





/**********************
*                     *
*     LOAD CONTENT    *
*                     *
***********************/

const changePage = (page, scriptName, scriptComp) => {
    global.currentPage = page;
    body.innerHTML = global.reloadContent(page, stylesComponent());
    global.defineVariables(scriptName, scriptComp);
}

// Set the current page to Home initially, then send a message to the main process to render that page, which
// should just come right back here in the reply area to setup the data from the global attributes.
global.currentPage = global.homePage;
ipc.send('changeCurrentPage-send', global.currentPage);
ipc.on('changeCurrentPage-reply', (event, page, scriptType) => {
    body.innerHTML = global.reloadContent(page, stylesComponent());
    switch(scriptType) {
        case 'home': global.defineVariables('home', (page) => { defineHomeScript(); }); break;
        case 'signup': global.defineVariables('signup', (page) => { defineSignupScript(); }); break;
        case 'login': global.defineVariables('login', (page) => { defineLoginScript(); }); break;
    }
});