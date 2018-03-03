const fs = require('fs');
const helpers = require('./helpers.js');
const alertify = require('alertify.js');

/** Everything is basically one big function that gets called by the renderer. */
module.exports = (body, titleBar, fireAuth, fireRef, backToHomeFunction) => {

    // 1.) Start by populating the body with the HTML for the signup page.
    // To do this, you will load that file with fs-extra, then place the
    // contents into the innerHTML of the body. Make sure you also clear out
    // whatever is currently there from the last page.
    body.innerHTML = '';
    const loadedPage = fs.readFileSync(__dirname + '/../html/signup.html', 'utf8');
    body.innerHTML = titleBar + loadedPage;
    

    /************************
    *                       *
    *       VARIABLES       *
    *                       *
    *************************/

    const emailField = document.getElementById('emailField_signup');
    const passwordField = document.getElementById('passwordField_signup');
    const passwordConfirmField = document.getElementById('passwordConfirmField_signup');

    const createAccountButton = document.getElementById('createAccountButton');
    const cancelButton = document.getElementById('closeSignupButton');


    /************************
    *                       *
    *       FUNCTIONS       *
    *                       *
    *************************/

    /**
    Handles creating an account on Noteworthy.
    */
    createAccountButton.onclick = function() {
        const email = emailField.value;
        const password = passwordField.value;
        const confirmPass = passwordConfirmField.value;

        // Make sure there is a value for each field.
        if( helpers. valueExists(email) && helpers.valueExists(password) && helpers.valueExists(confirmPass)) {

            // The object for the account data.
            const accountData = {
                "uid": ''
            };
            
            // Create the account.
            fireAuth.createUserWithEmailAndPassword(email, password).then( (auth) => {
                
                // Log in to the account right away.
                fireAuth.onAuthStateChanged((user) => {
                    if (user) {
                        accountData['uid'] = user.uid;
                        
                        alert('Welcome to Noteworthy, ' + firstName + "! Your account has been successfully created!");
                        backToHomeFunction();
                    } else { return; }
                });

            }).catch( (err) => {
                alert('There was a problem creating your account: \n' + err);
            });
            
        } else {
            if(!helpers.valueExists(email)) { emailField.style.border = '2px red solid'; }
            if(!helpers.valueExists(password)) { passwordField.style.border = '2px red solid'; }
            if(!helpers.valueExists(confirmPass)) { passwordConfirmField.style.border = '2px red solid'; }
        }
    }



    /**
    Cancels the sign up process and goes back to the home page.
    */
    cancelButton.onclick = function() {
        backToHomeFunction();
    }
};