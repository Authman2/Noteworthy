const fs = require('fs');
const helpers = require('./helpers.js');
const alertify = require('alertify.js');

/** Everything is basically one big function that gets called by the renderer. */
module.exports = (body, titleBar, fireAuth, fireRef, backToHomeFunction) => {

    // 1.) Start by populating the body with the HTML for the account page.
    // To do this, you will load that file with fs-extra, then place the
    // contents into the innerHTML of the body. Make sure you also clear out
    // whatever is currently there from the last page.
    body.innerHTML = '';
    const loadedPage = fs.readFileSync(__dirname + '/../html/account.html', 'utf8');
    body.innerHTML = titleBar + loadedPage;
    

    /************************
    *                       *
    *       VARIABLES       *
    *                       *
    *************************/

    const emailField = document.getElementById('emailField_account');
    const passwordField = document.getElementById('passwordField_account');

    const updateAccountBtn = document.getElementById('updateAccountButton');
    const logoutBtn = document.getElementById('logoutButton');
    const closeBtn = document.getElementById('closeAccountButton');
    

    /************************
    *                       *
    *       FUNCTIONS       *
    *                       *
    *************************/

    // First, set the placeholder text for the email input.
    fireAuth.onAuthStateChanged((user) => {
        if (user) {
            emailField.placeholder = user.email;
        } else { 
            backToHomeFunction();
        }
    });

    // Second, configure the logout button because it is easier than the update button.
    logoutBtn.onclick = () => {
        fireAuth.signOut().then(() => {
            // Go back to the home page.
            backToHomeFunction();

            // Remove the listener.
            fireRef.child('notes').off();
        });
    }

    // Third, setup the update account button.
    updateAccountBtn.onclick = () => {
        const email = emailField.value;
        const password = passwordField.value;

        // Check if there is a value for email.
        if(helpers.valueExists(email)) {
            fireAuth.currentUser.updateEmail(email).then(() => {
                alertify.success('Updated Email!');
            }).catch((err) => {
                alertify.error('There was an issue updating your email: ' + err);
            });
        }

        // Check if there is a value for password.
        if(helpers.valueExists(password)) {
            fireAuth.currentUser.updatePassword(password).then(() => {
                alertify.success('Updated Password!');
            }).catch((err) => {
                alertify.error('There was an issue updating your password: ' + err);
            });
        }
    }

    // Fourth, setup the close button.
    closeBtn.onclick = () => {
        backToHomeFunction();
    }
};