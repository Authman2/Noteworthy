const fs = require('fs');
const $ = require('jquery');
const marked = require('marked');
const turndown = require('turndown');
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
        firebase.auth().sendPasswordResetEmail(emailField.value);
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

/** Shows the login error alert. */
const showLoginErrorAlert = (root, error) => {
    const alert = fs.readFileSync(`${__dirname}/src/html/Alerts/LoginError.html`, 'utf8');
    $('#root').prepend(alert);

    const desc = document.getElementById('loginErrorDescription');
    desc.innerHTML = `${error}`;

    const closeBtn = document.getElementById('closeLoginErrorButton');
    const overlay = document.getElementById('overlay');
    closeBtn.onclick = () => {
        hideLoginErrorAlert(root);
    }
    overlay.onclick = () => {
        hideLoginErrorAlert(root);
    }
}

/** Hides the login error alert. */
const hideLoginErrorAlert = (root) => {
    const alert = document.getElementById('loginErrorAlert');
    const overlay = document.getElementById('overlay');
    root.removeChild(alert);
    root.removeChild(overlay);
}

/** Shows the sign up error alert. */
const showSignUpErrorAlert = (root, error) => {
    const alert = fs.readFileSync(`${__dirname}/src/html/Alerts/SignUpError.html`, 'utf8');
    $('#root').prepend(alert);

    const desc = document.getElementById('signUpErrorDescription');
    desc.innerHTML = `${error}`;

    const closeBtn = document.getElementById('closeSignUpErrorButton');
    const overlay = document.getElementById('overlay');
    closeBtn.onclick = () => {
        hideSignUpErrorAlert(root);
    }
    overlay.onclick = () => {
        hideSignUpErrorAlert(root);
    }
}

/** Hides the sign up alert. */
const hideSignUpErrorAlert = (root) => {
    const alert = document.getElementById('signUpErrorAlert');
    const overlay = document.getElementById('overlay');
    root.removeChild(alert);
    root.removeChild(overlay);
}

/** Shows the created account alert. */
const showCreatedAccountAlert = (root, then) => {
    const alert = fs.readFileSync(`${__dirname}/src/html/Alerts/CreatedAccount.html`, 'utf8');
    $('#root').prepend(alert);
    
    const closeBtn = document.getElementById('getStartedButton');
    const overlay = document.getElementById('overlay');
    closeBtn.onclick = () => {
        hideCreatedAccountAlert(root);
        then();
    }
    overlay.onclick = () => {
        hideCreatedAccountAlert(root);
    }
}

/** Hides the sign up alert. */
const hideCreatedAccountAlert = (root) => {
    const alert = document.getElementById('createdAccountAlert');
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
            failure(err);
        });
    },


    /** Sign up in firebase. */
    signUp: (email, password, success, failure) => {
        firebase.auth().createUserWithEmailAndPassword(email, password).then((snap) => {
            success();
        }).catch((err) => {
            failure(err);
        });
    },


    /** Shows the forgot password alert. */
    showForgotPasswordAlert: showForgotPasswordAlert,

    /** Hides the forgot password alert. */
    hideForgotPasswordAlert: hideForgotPasswordAlert,

    /** Shows the login error alert. */
    showLoginErrorAlert: showLoginErrorAlert,

    /** Hides the login error alert. */
    hideLoginErrorAlert: hideLoginErrorAlert,

    /** Shows the sign up error alert. */
    showSignUpErrorAlert: showSignUpErrorAlert,

    /** Hides the sign up error alert. */
    hideSignUpErrorAlert: hideSignUpErrorAlert,

    /** Shows the created account alert. */
    showCreatedAccountAlert: showCreatedAccountAlert,

    /** Hides the created account alert. */
    hideCreatedAccountAlert: hideCreatedAccountAlert,

    /** Maps an array of notebooks to notebook table cells. */
    mapNotebookToTableCell: (notebooks, onClick) => {
        return notebooks.map((val, _, __) => {
            const cell = document.createElement('div');
            const title = document.createElement('p');
            const created = document.createElement('p');
            const pages = document.createElement('p');
            cell.className = 'notebooksTableCell';
            title.className = 'notebooksTableCellTitleLabel';
            created.className = 'notebooksTableCellCreateLabel';
            pages.className = 'notebooksTableCellPagesLabel';
            title.innerHTML = `${val.title}`;
            created.innerHTML = `${val.created}`;
            pages.innerHTML = `Pages: ${val.pages.length}`;
            cell.appendChild(title);
            cell.appendChild(created);
            cell.appendChild(pages);
            cell.onclick = () => {
                onClick(val);   
            };
            return cell;
        })
    },

    /** Maps an array of notes to note table cells. */
    mapNoteToTableCell: (notebooks, onClick) => {
        return notebooks.map((val, _, __) => {
            const cell = document.createElement('div');
            const title = document.createElement('p');
            const preview = document.createElement('p');
            cell.className = 'noteTableCell';
            title.className = 'noteTableCellTitleLabel';
            preview.className = 'noteTableCellPreviewLabel';
            title.innerHTML = `${val.title}`;
            preview.innerHTML = `${val.content}`;
            cell.appendChild(title);
            cell.appendChild(preview);
            cell.onclick = () => {
                onClick(val);   
            };
            return cell;
        })
    }
}