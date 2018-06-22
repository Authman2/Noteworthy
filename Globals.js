const $ = require('jquery');
const fs = require('fs');
const firebase = require('firebase');
const config = require(__dirname + '/creds.json');
firebase.initializeApp(config);


/** Shows the forgot password alert. */
const showForgotPasswordAlert = (root) => {
    const alert = fs.readFileSync(`${__dirname}/src/html/Alerts/ForgotPassword.html`, 'utf8');
    $('#root').prepend(alert);

    const emailField = document.getElementById('resetPasswordField');
    const sendEmailBtn = document.getElementById('sendResetButton');
    const overlay = document.getElementById('overlay');
    sendEmailBtn.onclick = () => {
        console.log(emailField);
        hideForgotPasswordAlert(root);
    }
    overlay.onclick = () => {
        hideForgotPasswordAlert(root);
    }
}

/** Hides the forgot password alert. */
const hideForgotPasswordAlert = (root) => {
    const alert = document.getElementById('forgotPasswordAlert');
    const overlay = document.getElementById('overlay');
    root.removeChild(alert);
    root.removeChild(overlay);
}






module.exports = {

    /** Loads the html into the page. */
    loadHTMLInto: (fileName, root) => {
        const getHTML = fs.readFileSync(`${__dirname}/src/html/${fileName}`, 'utf8');
        root.innerHTML = "<div class='titleBar'></div>" + getHTML;
    },


    /** Login to firebase. */
    login: (email, password, success, failure) => {
        firebase.auth().signInWithEmailAndPassword(email, password).then((snap) => {
            success();
        }).catch((err) => {
            failure();
        });
    },


    /** Sign up in firebase. */
    signUp: (email, password, success, failure) => {
        firebase.auth().createUserWithEmailAndPassword(email, password).then((snap) => {
            success();
        }).catch((err) => {
            failure();
        });
    },


    /** Shows the forgot password alert. */
    showForgotPasswordAlert: showForgotPasswordAlert,

    /** Hides the forgot password alert. */
    hideForgotPasswordAlert: hideForgotPasswordAlert

}