const fs = require('fs');
const alertify = require('alertify.js');
const $ = require('jquery');
const path = require('path')
const url = require('url')
const spectrum = require('spectrum-colorpicker');
const ipc = require('electron').ipcRenderer;
const app = require('electron').remote.app;
const remote = require('electron').remote;
const {Menu, MenuItem} = remote;
const global = require('electron').remote.getGlobal('sharedObject');
const exec = require('child_process').exec;
const shell = require('shelljs');
const zip = require('jszip');
const nodemailer = require('nodemailer');

const firebase = require('firebase');
const config = require('../creds/creds.json')
firebase.initializeApp(config);

// The nodemailer client.
var t;

/**********************
*                     *
*      VARIABLES      *
*                     *
***********************/

// Important constants.
const body = document.getElementById('root');
const fireRef = firebase.database().ref();
const fireAuth = firebase.auth();

// Whether or not the options slider is open. Whether the sidebar is open.
var sliderOpen = false;
var sidebarOpen = false;

// The notebooks (and add notebook button) that are dislayed on the notebook slider.
var notebooks = [{
    id: '',
    title: 'New',
    content: '',
    creator: '',
    timestamp: 0
}];

// The id of the note that you are currently looking at. If it is a new note, this should be
// null. Otherwise, it will be a string.
var currentNoteID = null;

// The settings for the app.
var appSettings = {};
const loadSettings = () => {
    var lineReader = require('readline').createInterface({
        input: fs.createReadStream(__dirname + '/../../appSettings.txt')
    });
    lineReader.on('line', function (line) {
        const splt = line.split(' : ');
        const key = splt[0];
        const val = splt[1];
        appSettings[key] = val;
    });
}
loadSettings();

// The current writing settings. These don't change that much necessarily.
var writingSettings = {
    color: 'black',
    fontSize: '16px',
    fontFamily: 'Avenir',
    highlighterOn: false,
    alignment: 'justfiyLeft',
    bold: false,
    underline: false,
    italic: false,
    bulletedList: false,
    numberedList: false
}




/**********************
*                     *
*       METHODS       *
*                     *
***********************/

/** Loads all of the notes for a given user. Loads them asyncronously. */
const loadNotes = (uid) => {
    fireRef.child('notes').orderByChild('creator').equalTo(uid).on('child_added', (snap) => {
        var a = snap.val();
        notebooks.push(a);
        notebooks = notebooks.sort((a,b) => { return a.timestamp - b.timestamp });

        configureNotbookSlider(document.getElementById('sidebar'),
                        document.getElementById('titleArea'),
                        document.getElementById('noteArea'));                  
    });
}

/** Sets up the data in the notebook slider. */
const configureNotbookSlider = (list, titleField, noteField) => {
    // Clear the list.
    list.innerHTML = "<h4 id='sidebarTitle' style='color:" + appSettings.sidebarTextColor + "'>Notes</h4>";

    for(var i = 0; i < notebooks.length; i++) {
        const current = notebooks[i];

        // Create the list item.
        const item = document.createElement('div');
        item.className = 'sidebarItem';

        const title = document.createElement('p');
        title.className = 'sidebarItemTitle';
        title.innerHTML = current.title;
        title.style.color = appSettings.sidebarTextColor;

        item.appendChild(title);


        // Define click behavior.
        const closeSidebar = () => {
            document.getElementById('sidebarButton').style.right = '15px';
            document.getElementById('sidebar').style.right = '-200px';
            sidebarOpen = false;
            document.getElementById('optionsButton').style.opacity = 1;
        }
        const displayText = () => {
            noteField.focus();
            noteField.innerHTML = current.content;
            currentNoteID = current.id;
        }

        if(current.title === 'New') {
            item.onclick = () => {
                if(forgotToSave(titleField, noteField)) {
                    showPromptDialog('Looks like you forgot to save. Would you like to continue anyway?', 
                    "Continue", "Cancel", () => {
                        titleField.value = '';
                        noteField.innerHTML = '';
                        global.currentTitle = '';
                        global.currentContent = '';
                        currentNoteID = null;
                        closeSidebar();
                    });
                } else {
                    titleField.value = '';
                    noteField.innerHTML = '';
                    global.currentTitle = '';
                    global.currentContent = '';
                    currentNoteID = null;
                    closeSidebar();
                }
            }
        } else {
            item.onclick = () => {
                if(forgotToSave(titleField, noteField)) {
                    showPromptDialog('Looks like you forgot to save. Would you like to continue anyway?', 
                    "Continue", "Cancel", () => {
                        titleField.value = current.title;
                        noteField.innerHTML = current.content;
                        global.currentTitle = current.title;
                        global.currentContent = current.content;
                        currentNoteID = current.id;
                        displayText();
                    });
                } else {
                    titleField.value = current.title;
                    noteField.innerHTML = current.content;
                    global.currentTitle = current.title;
                    global.currentContent = current.content;
                    currentNoteID = current.id;
                    displayText();
                }
            }
        }

        // Define the mouse behavior.
        const noteCxtMenu = new Menu();
        noteCxtMenu.append(new MenuItem({
            label: 'Delete',
            click: () => {
                showPromptDialog('Are you sure you want to delete this note?', 'Yes', 'No', () => {
                    deleteNote(current.id);
                });
            }
        }));
        item.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            noteCxtMenu.popup(remote.getCurrentWindow());
        }, false);


        // Add to the sidebar.
        list.appendChild(item);
    }
};

/** Handles saving a note to the database under a certain user. */
const saveNote = (title, content) => {
    // If null, save a new note. Otherwise, update the old one.
    if(currentNoteID === null) {
        const ref = fireRef.child('notes').push();
        const data = {
            id: ref.key,
            title: title,
            content: content,
            creator: global.currentUser.uid, // Assumes that a user is already logged in.
            timestamp: Date.now()
        }
        currentNoteID = ref.key;
        ref.set(data);
    } else {
        const data = {
            id: currentNoteID,
            title: title,
            content: content,
        }
        fireRef.child('notes').child(currentNoteID).update(data);
    }

    // Make sure to update the local copy.
    for(var i = 0; i < notebooks.length; i++) {
        if(notebooks[i].id === currentNoteID) {
            notebooks[i].title = title;
            notebooks[i].content = content;
            break;
        }
    }
    
    alertify.success('Saved!');
}

/** Checks if the user forgot to save before moving on to something else, like clicking 
* another note or switching pages.
*/
const forgotToSave = (titleField, noteField) => {
    const title = titleField.value;
    const content = noteField.innerHTML;

    if(currentNoteID !== null) {
        for(var i = 0; i < notebooks.length; i++) {
            if(notebooks[i].id === currentNoteID) {
                if(notebooks[i].title !== title || notebooks[i].content !== content) {
                    return true;
                }
                break;
            }
        }
    } else {
        if(title !== '' || content !== '') return true;
        return false;
    }
    return false;
}



/**********************
*                     *
*       HELPERS       *
*                     *
***********************/

/** Checks if a value exists for a given element. */
const valueExists = (element) => {
    if(element === undefined || element === null) return false;
    if(element === '' || element === ' ') return false;
    return true;
}

/** Shows the prompt dialog from alertify.js */
const showPromptDialog = (message, acceptTitle, declineTitle, success) => {
    alertify.okBtn(acceptTitle).cancelBtn(declineTitle)
    .confirm(message, function (ev) {
        ev.preventDefault();
        success();
    }, function(ev) {
        ev.preventDefault();
    });
}

/** Checks if the key pressed is not a special key */
const isSpecialKey = (element) => {
    if(element === 'ShiftLeft' || element === 'MetaLeft' || element === 'Space' || element === 'Backspace'
    || element === 'ShiftRight' || element === 'MetaRight') {
        return true;
    }
    return false;
}

/** Returns the current note as a JSON object. */
const getCurrentNote = () => {
    if(currentNoteID !== null) {
        for(var i = 0; i < notebooks.length; i++) {
            if(notebooks[i].id === currentNoteID) {
                return notebooks[i];
            }
        }
    } else {
        return {
            id: '',
            title: 'New',
            content: '',
            creator: '',
            timestamp: 0
        };
    }
}

/** Deletes a note from the database. */
const deleteNote = (noteID) => {
    fireRef.child('notes').child(noteID).remove();
    document.getElementById('titleArea').value = '';
    document.getElementById('noteArea').innerHTML = '';

    // Reload notes.
    notebooks = [{
        id: '',
        title: 'New',
        content: '',
        creator: '',
        timestamp: 0
    }];
    loadNotes(global.currentUser.uid);
}




/**********************
*                     *
*     RENDER STYLE    *
*                     *
***********************/

const stylesComponent = () => { 
    return '<link rel="stylesheet" type="text/css" href="src/styles/home.css">'
    + '<link rel="stylesheet" type="text/css" href="src/styles/signup.css">'
    + '<link rel="stylesheet" type="text/css" href="src/styles/login.css">'
    + '<link rel="stylesheet" type="text/css" href="src/styles/appSettings.css">'
    + '<link rel="stylesheet" type="text/css" href="src/styles/account.css">'
    + '<link rel="stylesheet" type="text/css" href="src/styles/sidebar.css">'
    + '<link rel="stylesheet" type="text/css" href="src/styles/optionsSlider.css">'
    + '<link rel="stylesheet" type="text/css" href="src/styles/codeSegment.css">'
    + '<link rel="stylesheet" type="text/css" href="src/styles/titleBar.css">';
}



/**********************
*                     *
*     HOME SCRIPT     *
*                     *
***********************/

/** Defines all script behavior for the home page. */
const defineHomeScript = () => {
    // Variables.
    const titleField = document.getElementById('titleArea');
    const noteField = document.getElementById('noteArea');

    const optionsSlider = document.getElementById('optionsSlider');
    const sidebar = document.getElementById('sidebar');

    const optionsButton = document.getElementById('optionsButton');
    const sidebarButton = document.getElementById('sidebarButton');

    const optionsTitleLabels = document.getElementsByClassName('optionsItemTitle');


    // Start input event listener.
    titleField.onkeyup = () => { global.currentTitle = titleField.value; }
    noteField.onkeypress = (e) => { writeToNoteArea(e.key, noteField); }
    noteField.onkeydown = (e) => {
        if(e.key === 'Tab') {
            document.execCommand('insertHTML', false, '\u00a0\u00a0\u00a0\u00a0');
            e.preventDefault();
        }
    }


    // Run some methods initially.
    configureFontSelector();
    handleOptionsSliderButtons();
    manageEditListeners(titleField, noteField);
    
    // Show the last note when coming back from another page.
    if(currentNoteID !== null) {
        for(var i = 0; i < notebooks.length; i++) {
            if(notebooks[i].id === currentNoteID) {
                titleField.value = notebooks[i].title;
                noteField.innerHTML = notebooks[i].content;
                break;
            }
        }
    }

    // Reset some variables.
    notebooks = [{
        id: '',
        title: 'New',
        content: '',
        creator: '',
        timestamp: 0
    }];
    global.currentTitle = '';
    global.currentContent = '';
    sidebarOpen = false;
    sliderOpen = false;
    
    // Auto login.
    if(global.currentUser === null) autoLogin();
    
    // Set the colors based on the app settings
    optionsButton.style.backgroundColor = appSettings.colorScheme;
    optionsSlider.style.backgroundColor = appSettings.colorScheme;
    sidebar.style.backgroundColor = appSettings.colorScheme;
    // Cannot set sidebar titles colors here.
    for(var i = 0; i < optionsTitleLabels.length; i++) {
        optionsTitleLabels[i].style.color = appSettings.sidebarTextColor;
    }

    // Load all of the user's notebooks.
    if(global.currentUser !== null) loadNotes(global.currentUser.uid);



    // Toggle the notebook slider.
    optionsButton.onclick = function() {
        if(sliderOpen) {
            optionsButton.style.bottom = '30px';
            optionsSlider.style.bottom = '-80px';
            sliderOpen = false;
        } else {
            optionsButton.style.bottom = '110px';
            optionsSlider.style.bottom = '0px';
            sliderOpen = true;
            optionsSlider.focus();
        }
    }
    // Toggle the sidebar.
    sidebarButton.onclick = function() {
        if(sidebarOpen) {
            sidebarButton.style.right = '15px';
            sidebar.style.right = '-200px';
            sidebarOpen = false;
            optionsButton.style.opacity = 1;
        } else {
            sidebarButton.style.right = '215px';
            sidebar.style.right = '0px';
            sidebarOpen = true;
            optionsButton.style.opacity = 0.3;
        }
    }
}

/** Handles automatically logging in a user that is already signed in. */
const autoLogin = () => {
    fireAuth.onAuthStateChanged((user) => {
        if (user) {
            fireRef.child('users').child(user.uid).once('value', (snap) => {
                const a = {
                    firstName: snap.val().firstName,
                    lastName: snap.val().lastName,
                    uid: snap.val().uid,
                    notes: snap.val().notes ? snap.val().notes : []
                }
                global.currentUser = a;
                loadNotes(global.currentUser.uid);
            })
        } else { return; }
    });
}

// The note area is really just an editable div, and this method lets you type into it.
// This method is deprecated now, but keep it here for a while anyway.
// NOT BEING USED.
const writeToNoteArea = (key, noteField) => {

    // // Now, after making sure it is not a special key, create the span for that key alone.
    // if(!isSpecialKey(key)) {
    //     var span = document.createElement('span');
    //     var spanText = key;
        
    //     // Set the inner text to span text.
    //     span.innerHTML = spanText;
        
    //     // Use the current writing styles.
    //     span.style.color = writingSettings.color;
    //     if(writingSettings.bold) span.style.fontWeight = 'bold';
    //     if(writingSettings.underline) span.style.textDecoration = 'underline';
    //     if(writingSettings.italic) span.style.fontStyle = 'italic';
    //     if(writingSettings.highlighterOn) span.style.backgroundColor = '#FFFF00';

    //     noteField.appendChild(span);
    // }

    // placeCaretAtEnd(noteArea);
};

// Always makes sure the caret is at the end of the text input.
const placeCaretAtEnd = (el) => {
    el.focus();
    if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
    }
}

// Handles button presses in the sidebar.
const handleOptionsSliderButtons = () => {
    // Color
    $('#sidebar_Color').spectrum({
        color: writingSettings.color,
        showInput: true,
        change: function(color) {
            writingSettings.color = color.toRgbString();
            document.execCommand('foreColor', false, writingSettings.color);
        }
    });
    
    // Font
    $('#sidebar_Font').click(() => {
        const dialog = document.getElementById('fontDialog');
        if(dialog.hasAttribute('open')) { dialog.removeAttribute('open'); }
        else { dialog.setAttribute('open', true); dialog.focus(); }
    });

    // Alignment
    $('#sidebar_Alignment').click( () => {
        if(writingSettings.alignment === 'justifyLeft') {
            writingSettings.alignment = 'justifyCenter';
        } else if(writingSettings.alignment === 'justifyCenter') {
            writingSettings.alignment = 'justifyRight';
        } else {
            writingSettings.alignment = 'justifyLeft';
        }
        document.execCommand(writingSettings.alignment, false);
    });

    // Bold
    $('#sidebar_Bold').click( () => {
        writingSettings.bold = !writingSettings.bold;
        document.execCommand('bold', false, writingSettings.bold);
    });

    // Underline
    $('#sidebar_Underline').click( () => {
        writingSettings.underline = !writingSettings.underline;
        document.execCommand('underline', false, writingSettings.underline);
    });

    // Italic
    $('#sidebar_Italic').click( () => {
        writingSettings.italic = !writingSettings.italic;
        document.execCommand('italic', false, writingSettings.italic);
    });

    // Highlighter
    $('#sidebar_Highlighter').click( () => {
        writingSettings.highlighterOn = !writingSettings.highlighterOn;
        document.execCommand('backColor', false, '#FFE000');
    });

    // Lists
    $('#sidebar_BulletedList').click( () => {
        writingSettings.bulletedList = !writingSettings.bulletedList;
        writingSettings.numberedList = false;

        document.execCommand('insertUnorderedList', false);
    });
    $('#sidebar_NumberedList').click( () => {
        writingSettings.numberedList = !writingSettings.numberedList;
        writingSettings.bulletedList = false;

        document.execCommand('insertOrderedList', false);
    });
}

// Font selection
const configureFontSelector = () => {
    const dialog = document.getElementById('fontDialog');
    
    const selector = document.getElementById('fontSelector');
    const options = document.getElementsByTagName('option');
    const sizeInput = document.getElementById('fontSizeSelector');

    const saveBtn = document.getElementById('saveFontButton');
    const cancelBtn = document.getElementById('cancelFontButton');


    // Setup dragging on the font selector.
    body.ondrop = (ev) => {
        ev.preventDefault();
    }
    body.ondragover = (ev) => {
        ev.preventDefault();
        $('#fontDialog').offset({
            top: ev.pageY - $('#fontDialog').outerHeight() / 2,
            left: ev.pageX - $('#fontDialog').outerWidth() / 2
        });
    }
    dialog.ondrop = (ev) => {
        ev.preventDefault();
    }


    // Set each font to itself... basically.
    for(var i = 0; i < options.length; i++) {
        options[i].style.fontFamily = options[i].innerHTML;
    }

    saveBtn.onclick = () => {
        document.execCommand('fontName', false, selector.value);

        // Changing the font size is a little different than other stylings.
        const span = "<span style='font-size: " + sizeInput.value + "px'>" + document.getSelection().toString() + "</span>";
        document.execCommand('insertHTML', false, span);

        writingSettings.fontFamily = selector.value;
        writingSettings.fontSize = sizeInput.value;
        dialog.removeAttribute('open');
    };
    cancelBtn.onclick = () => {
        dialog.removeAttribute('open');
    };
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
*    ACCOUNT SCRIPT   *
*                     *
***********************/

const defineAccountScript = () => {
    const emailField = document.getElementById('emailField_account');
    const passwordField = document.getElementById('passwordField_account');

    const updateAccountBtn = document.getElementById('updateAccountButton');
    const logoutBtn = document.getElementById('logoutButton');
    const closeBtn = document.getElementById('closeAccountButton');

    // First, set the placeholder text for the email input.
    fireAuth.onAuthStateChanged((user) => {
        if (user) {
            emailField.placeholder = user.email;
        } else { 
            changePage(global.loginPage, 'login', () => { defineLoginScript() });
        }
    });

    // Second, configure the logout button because it is easier than the update button.
    logoutBtn.onclick = () => {
        fireAuth.signOut().then(() => {
            // Go back to the home page.
            changePage(global.homePage, 'home', () => { defineHomeScript() });

            // Clear all notes.
            notebooks = [{
                id: '',
                title: 'New',
                content: '',
                creator: '',
                timestamp: 0
            }];

            // Remove the listener.
            fireRef.child('notes').off();
        });
    }

    // Third, setup the update account button.
    updateAccountBtn.onclick = () => {
        const email = emailField.value;
        const password = passwordField.value;

        // Check if there is a value for email.
        if(valueExists(email)) {
            fireAuth.currentUser.updateEmail(email).then(() => {
                alertify.success('Updated Email!');
            }).catch((err) => {
                alertify.error('There was an issue updating your email: ' + err);
            });
        }

        // Check if there is a value for password.
        if(valueExists(password)) {
            fireAuth.currentUser.updatePassword(password).then(() => {
                alertify.success('Updated Password!');
            }).catch((err) => {
                alertify.error('There was an issue updating your password: ' + err);
            });
        }
    }

    // Fourth, setup the close button.
    closeBtn.onclick = () => {
        changePage(global.homePage, 'home', () => { defineHomeScript() });
    }
}

/**********************
*                     *
*   SETTINGS SCRIPT   *
*                     *
***********************/

const defineAppSettingsScript = () => {
    const closeButton = document.getElementById('closeSettingsButton');
    const saveButton = document.getElementById('saveSettingsButton');

    
    // Load the current settings.
    var tempSettings = Object.assign({}, appSettings);



    closeButton.onclick = () => {
        for(var i in tempSettings) {
            if(tempSettings[i] !== appSettings[i]) {
                showPromptDialog('You haven\'t saved the modified settings. Do you still want to close this page?',
                'Continue', 'Cancel', () => {
                    changePage(global.homePage, 'home', () => { defineHomeScript() });
                });
                return;
            }
        }
        changePage(global.homePage, 'home', () => { defineHomeScript() });
    }
    saveButton.onclick = () => {
        appSettings = Object.assign({}, tempSettings);
        
        // Save the new settings, then reload them again to make sure you have the newest one.
        var saveString = '';
        for(var i in appSettings) {
            saveString += i + ' : ' + appSettings[i] + '\n';
        }
        fs.writeFileSync(__dirname + '/../../appSettings.txt', saveString, 'utf8');
        loadSettings();

        changePage(global.homePage, 'home', () => { defineHomeScript() });
        alertify.success('Updated settings!');
    }


    // Choose color scheme.
    $('#chooseColorSchemeButton').spectrum({
        color: appSettings.colorScheme,
        showInput: true,
        change: function(color) {
            tempSettings['colorScheme'] = color.toRgbString();
        }
    });

    // Choose sidebar text color.
    $('#chooseSidebarTextButton').spectrum({
        color: appSettings.sidebarTextColor,
        showInput: true,
        change: function(color) {
            tempSettings['sidebarTextColor'] = color.toRgbString();
        }
    })
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
    body.innerHTML = global.reloadContent(global.titleBar + page, stylesComponent());
    switch(scriptType) {
        case 'home': global.defineVariables('home', (page) => { defineHomeScript(); }); break;
        case 'signup': global.defineVariables('signup', (page) => { defineSignupScript(); }); break;
        case 'login': global.defineVariables('login', (page) => { defineLoginScript(); }); break;
        case 'account': global.defineVariables('account', (page) => { defineAccountScript(); }); break;
        case 'appsettings': global.defineVariables('appsettings', (page) => { defineAppSettingsScript() }); break;
    }
});



// A bunch of code for managing certain listeners
const manageEditListeners = (titleField, noteField) => {
    // Send a save message initially. This is for saving a note later on.
    //ipc.send('saveNote-send', titleField.value, noteField.value);
    ipc.on('saveNote-reply', (event, title) => {
        const content = document.getElementById('noteArea').innerHTML;
        if(title !== '' && content !== '') {
            if(global.currentUser === null) {
                alert('You must be logged in to save notes.');
                return;
            } else {
                saveNote(title, content);
            }
        } else {}
    });

    // Gets the currently selected text from the note area.
    //ipc.send('cutText-send', noteField.value);
    ipc.on('cutText-reply', (event) => {
        document.execCommand('cut', false);
    });

    // Gets the currently selected text from the note area.
    //ipc.send('copyText-send', window.getSelection().toString());
    ipc.on('copyText-reply', (event) => {
        document.execCommand('copy', false);
    });

    // Handles pasting the copied text into the text area.
    //ipc.send('pasteText-send', window.getSelection().toString());
    ipc.on('pasteText-reply', (event) => {
        document.execCommand('paste', false);
    });
    
    // Handles selecting all the text.
    //ipc.send('selectAllText-send', window.getSelection().toString());
    ipc.on('selectAllText-reply', (event) => {
        document.execCommand('selectAll', false);
    });

    // Handles printing out the document.
    //ipc.send('handlePrint-send', window.getSelection().toString());
    ipc.on('handlePrint-reply', (event) => {
        window.print();
    });

    // Handles undo and redo.
    ipc.on('undo-reply', (event) => {
        document.execCommand('undo', false);
    });
    ipc.on('redo-reply', (event) => {
        document.execCommand('redo', false);
    });


    // Insert
    ipc.on('subscript-reply', (event) => {
        document.execCommand('subscript', true);
    });
    ipc.on('superscript-reply', (event) => {
        document.execCommand('superscript', true);
    });
    ipc.on('bulletedList-reply', (event) => {
        writingSettings.bulletedList = !writingSettings.bulletedList;
        writingSettings.numberedList = false;

        document.execCommand('insertUnorderedList', false);
    });
    ipc.on('numberedList-reply', (event) => {
        writingSettings.numberedList = !writingSettings.numberedList;
        writingSettings.bulletedList = false;

        document.execCommand('insertOrderedList', false);
    });
    ipc.on('insertCodeSegment-reply', (event) => {
        // Create the code segment.
        const bgColor = 'background-color: rgb(229, 229, 229);';
        const codeSegment = '<div class="codeSegmentArea" contentEditable="true" tabindex="1" style="' + bgColor + '">Start typing code here</div>';

        // Insert it into the note area.
        document.execCommand('insertHTML', true, '<br>' + codeSegment + '<br>');
    });



    // Shortcuts
    ipc.on('bold-reply', (event) => {
        writingSettings.bold = !writingSettings.bold;
        document.execCommand('bold', true, writingSettings.bold);
    });
    ipc.on('underline-reply', (event) => {
        writingSettings.underline = !writingSettings.underline;
        document.execCommand('underline', true, writingSettings.underline);
    });
    ipc.on('italic-reply', (event) => {
        writingSettings.italic = !writingSettings.italic;
        document.execCommand('italic', true, writingSettings.italic);
    });
    ipc.on('font-reply', (event) => {
        document.getElementById('fontDialog').setAttribute('open', true);
    });
    ipc.on('alignLeft-reply', (event) => {
        writingSettings.alignment = 'justifyLeft';
        document.execCommand(writingSettings.alignment, false);
    });
    ipc.on('alignCenter-reply', (event) => {
        writingSettings.alignment = 'justifyCenter';
        document.execCommand(writingSettings.alignment, false);
    });
    ipc.on('alignRight-reply', (event) => {
        writingSettings.alignment = 'justifyRight';
        document.execCommand(writingSettings.alignment, false);
    });
    ipc.on('highlight-reply', (event) => {
        writingSettings.highlighterOn = !writingSettings.highlighterOn;
        if(writingSettings.highlighterOn === true) {
            document.execCommand('backColor', false, '#FFE000');
        } else {
            document.execCommand('backColor', false, 'rgba(0,0,0,0)');
        }
    });
    ipc.on('shareemail-reply', (event) => {
        // Show email window.
        const btnClick = '';
        var alrt = '<div style="text-align:center">';
        alrt += '<h2 style="font-size:18px;margin-top:-15px">Enter your settings for this email:</h2>';
        alrt += '<input id="email-from-field" type="text" placeholder="sender@mail.com"/>';
        alrt += '<br>';
        alrt += '<input id="email-password-field" type="password" placeholder="sender password"/>';
        alrt += '<br>';
        alrt += '<input id="email-to-field" type="text" placeholder="receiver@mail.com"/>';
        alrt += '<br>';
        alrt += '</div>';
        alertify.okBtn('Send!').confirm(alrt, () => {
            t = nodemailer.createTransport({
                service: 'Gmail',
                secure: 'false',
                auth: {
                    user: document.getElementById('email-from-field').value,
                    pass: document.getElementById('email-password-field').value,
                },
                tls: {
                    rejectUnauthorized: false,
                }
            });

            t.verify(function(error, success) {
                if (error) {
                    alertify.okBtn('Ok').alert('You are not able to send an email from this app due to your current email security rules.'
                                    + ' Check your email for a message on how you can change your settings to allow for sending'
                                    + ' email from Noteworthy');
                    return;
                } else {
                    t.sendMail({
                        from: document.getElementById('email-from-field').value,
                        to: document.getElementById('email-to-field').value,
                        subject: getCurrentNote().title,
                        text: noteField.innerText,
                        html: noteField.innerHTML
                    }, (err) => {
                        if(err) { alertify.alert('' + err); return; }
                        alertify.alert('Email Sent!');
                        return;
                    });
                }
            });
            
        }, () => {
            // Nothing.
        });
        document.getElementById('email-from-field').placeholder = "sender@mail.com";
        return;
    })
}

ipc.on('openSidebar-reply', (event) => {
    if(sidebarOpen) {
        document.getElementById('sidebarButton').style.right = '15px';
        document.getElementById('sidebar').style.right = '-200px';
        sidebarOpen = false;
        document.getElementById('optionsButton').style.opacity = 1;
    } else {
        document.getElementById('sidebarButton').style.right = '215px';
        document.getElementById('sidebar').style.right = '0px';
        sidebarOpen = true;
        document.getElementById('optionsButton').style.opacity = 0.3;
    }
});
ipc.on('viewNotes-reply', (event) => {
    if(sliderOpen) {
        document.getElementById('optionsButton').style.bottom = '30px';
        document.getElementById('optionsSlider').style.bottom = '-80px';
        sliderOpen = false;
    } else {
        document.getElementById('optionsButton').style.bottom = '110px';
        document.getElementById('optionsSlider').style.bottom = '0px';
        sliderOpen = true;
    }
});
ipc.on('checkForUpdates-reply', (event) => {
    fireRef.child('Version').once('value', (snap) => {
        const latestVersion = snap.val();

        if(app.getVersion() !== latestVersion) {
            // Get the newest updates
            fireRef.child('NewInThisVersion').once('value', (snap2) => {
                const btnStyle = 'width:100px; height:35px; border:none; outline:none; cursor:pointer; background:none; border-radius:25px; background-color:lightgreen;';
                const btnClick = "const shell = require('shelljs'); shell.config.execPath='/usr/local/bin/node'; shell.exec('open http://www.adeolauthman.com');";
    
                var alrt = '<div style="text-align:center">';
                alrt += '<p style="font-size:18px;">There is a new version of Noteworthy!</p>';
                alrt += '<h3>Version ' + latestVersion + '!</h3>';
                alrt += '<p>1.) Head over to www.adeolauthman.com<br>2.) Go to Noteworthy under the "Projects" tab to download the latest version.';
                alrt += '<br><br>';
                alrt += '<p> <b>New in Version ' + latestVersion + ':</b> ' + snap2.val() + '</p>';
                alrt += '<button onclick="' + btnClick + '" style="' + btnStyle + '">Go to Website</button>';
                alrt += '</div>';
                alertify.alert(alrt);
    
            });
            
        } else {
            alert("You already have the latest version of Noteworthy!");
        }
    })
});
ipc.on('backupNotes-reply', (event) => {
    showPromptDialog('Backing up your notes will save a local copy to your computer. Be sure to do this often to avoid losing your notes. Below, enter the location where you would like the backup to be stored.', 'Choose Backup Location', 'Cancel', () => {
        const { dialog } = require('electron').remote;
        dialog.showOpenDialog(null, {
            properties: ['openDirectory']
        }, (paths) => {
            if(paths !== undefined) {
                
                // Create a folder for the notes.
                const path = paths[0] + '/NoteworthyNotes_' + global.currentUser.firstName + global.currentUser.lastName;
                fs.mkdir(path);

                // Write files for each note to this folder.
                for(var i = 1; i < notebooks.length; i++) {
                    const current = notebooks[i];
                    const fileName = path + '/' + current.title + '_' + Date.now() + '.txt';
                    shell.touch(fileName);
                    fs.writeFileSync(fileName, JSON.stringify(current), 'utf8');
                }
                alert('Your notes have been backed up successfully!');
            }
        });
    });
    
});