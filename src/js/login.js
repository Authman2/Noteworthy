const fs = require('fs');
const helpers = require('./helpers.js');
const global = require('electron').remote.getGlobal('sharedObject');
const alertify = require('alertify.js');

/** Everything is basically one big function that gets called by the renderer. */
module.exports = (body, titleBar, fireAuth, fireRef, appSettings, backToHomeFunction) => {

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
    const forgotPasswordButton = document.getElementById('forgotPasswordButton');
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
                if(user) {
                    const a = {
                        uid: user.uid
                    }

                    global.currentUser = a;
                    backToHomeFunction();
                    return;
                }
            }).catch((err) => {
                alert('There was a problem logging in. \n' + err);
            });

        } else {
            alert('Missing Credentials. Please enter all fields to login.');
        }
    }
    forgotPasswordButton.onclick = () => {
        // const content = `<div><h4>Enter your email address to reset your password.</h4><br><input type='email' id='reset-email-field' style='width:100%;height:20px;outline:none;background:none;text-decoration:none;'/><br><button class='rect-button' style='width:150px;height:40px;font-size:16px'>Send Reset Email</button></div>`;
        // alertify.alert(content);
        helpers.showPromptDialog('Enter your email to reset your password.', 'Send Email', 'Cancel', appSettings, (inp) => {
            fireAuth.sendPasswordResetEmail(inp).then(function() {
                    helpers.showMessageDialog('Password reset email has been sent!', 'Ok', null, appSettings, () => {});
              }).catch(function(error) {
                    helpers.showMessageDialog('There was an issue sending a password reset email.', 'Ok', null, appSettings, () => {});
              });
        })
    }
};