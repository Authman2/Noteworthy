/************************
*                       *
*        REQUIRES       *
*                       *
*************************/

const fs = require('fs');
const Globals = require('../../Globals.js');


/************************
*                       *
*       VARIABLES       *
*                       *
*************************/

// The sign up and login buttons.
var loginButton;
var signUpButton;

// The email and password fields.
var emailField;
var passwordField;

// The forgot password button.
var forgotPasswordButton;

// Whether or not this page is in login or sign up mode.
var isLoginMode = true;




/************************
*                       *
*          INIT         *
*                       *
*************************/

/** Start the home page actions. */
const init = (root, pageManager) => {
    Globals.loadHTMLInto('Home.html', root);
    setupRefs();

    // Button clicks.
    loginButton.onclick = handleLogin;
    signUpButton.onclick = handleSignUp;
    forgotPasswordButton.onclick = handleForgotPassword;


}

/** Gets the references to all of the variables. */
const setupRefs = () => {
    loginButton = document.getElementById('loginButton');
    signUpButton = document.getElementById('signUpButton');
    emailField = document.getElementById('emailField');
    passwordField = document.getElementById('passwordField');
    forgotPasswordButton = document.getElementById('forgotPasswordButton');
}




/************************
*                       *
*       FUNCTIONS       *
*                       *
*************************/

/** Handles logging in and going to the work page. */
const handleLogin = () => {
    // Firebase login.
}

/** Animates the email and password field so that they go into sign up mode. */
const handleSignUp = () => {
    isLoginMode = !isLoginMode;

    switch(isLoginMode) {
        case true:
            emailField.style.opacity = 0;
            passwordField.style.opacity = 0;
            // loginButton.style.opacity = 0;
            // signUpButton.style.opacity = 0;
            setTimeout(() => {
                emailField.placeholder = 'Email';
                passwordField.placeholder = 'Password';
                loginButton.innerHTML = 'Login';
                signUpButton.innerHTML = 'Sign Up';
                loginButton.style.width = '100px';
                signUpButton.style.width = '140px';

                emailField.style.opacity = 1;
                passwordField.style.opacity = 1;
                // loginButton.style.opacity = 1;
                // signUpButton.style.opacity = 1;
            }, 200);
            
            break;
        case false:
            emailField.style.opacity = 0;
            passwordField.style.opacity = 0;
            // loginButton.style.opacity = 0;
            // signUpButton.style.opacity = 0;
                loginButton.style.width = '180px';
                signUpButton.style.width = '100px';
            setTimeout(() => {
                emailField.placeholder = 'Enter your email';
                passwordField.placeholder = 'Create a password';
                loginButton.innerHTML = 'Create Account';
                signUpButton.innerHTML = 'Cancel';

                emailField.style.opacity = 1;
                passwordField.style.opacity = 1;
                // loginButton.style.opacity = 1;
                // signUpButton.style.opacity = 1;
            }, 200);
            break;
    }
}

/** Brings up an alert to reset the password. */
const handleForgotPassword = () => {
    console.log('forgot password');
}




/************************
*                       *
*         EVENTS        *
*                       *
*************************/

module.exports = {
    init: init
}