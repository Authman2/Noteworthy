const fs = require('fs');
const helpers = require('./helpers.js');
const global = require('electron').remote.getGlobal('sharedObject');


/** Everything is basically one big function that gets called by the renderer. */
module.exports = (body, titleBar, fireAuth, fireRef, backToHomeFunction) => {

    // 1.) Start by populating the body with the HTML for the login page.
    // To do this, you will load that file with fs-extra, then place the
    // contents into the innerHTML of the body. Make sure you also clear out
    // whatever is currently there from the last page.
    body.innerHTML = '';
    const loadedPage = fs.readFileSync(__dirname + '/../html/login.html', 'utf8');
    body.innerHTML = titleBar + loadedPage;
    

    /************************
    *                       *
    *       VARIABLES       *
    *                       *
    *************************/

    const emailField = document.getElementById('emailField_login');
    const passwordField = document.getElementById('passwordField_login');

    const loginButton = document.getElementById('loginButton');
    const cancelButton = document.getElementById('closeLoginButton');



    /************************
    *                       *
    *       FUNCTIONS       *
    *                       *
    *************************/

    cancelButton.onclick = () => {
        backToHomeFunction();
    }
    loginButton.onclick = () => {
        const email = emailField.value;
        const password = passwordField.value;

        if(helpers.valueExists(email) && helpers.valueExists(password)) {

            fireAuth.signInWithEmailAndPassword(email, password).then( (user) => {
                fireRef.child('users').child(user.uid).once('value', (snap) => {
                    const a = {
                        firstName: snap.val().firstName,
                        lastName: snap.val().lastName,
                        uid: snap.val().uid
                    }

                    global.currentUser = a;
                    console.log(global);
                    backToHomeFunction();
                    return;
                });

            }).catch((err) => {
                alert('There was a problem logging in. \n' + err);
            });

        } else {
            alert('Missing Credentials. Please enter all fields to login.');
        }
    }
};