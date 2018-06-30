const fs = require('fs');
const $ = require('jquery');
const firebase = require('firebase');
const alertify = require('alertify.js');
const nodemailer = require('nodemailer');
const config = require(__dirname + '/creds.json');
firebase.initializeApp(config);

/** Shows the backup alert. */
const showBackupAlert = (root, notebooks) => {
    const alert = fs.readFileSync(`${__dirname}/src/html/Alerts/BackupAlert.html`, 'utf8');
    $('#root').prepend(alert);

    const locationField = document.getElementById('backupLocationField');
    locationField.onfocus = () => {
        const { dialog } = require('electron').remote;
        dialog.showOpenDialog(null, {
            properties: ['openDirectory']
        }, (paths) => {
            if(paths !== undefined) {
                locationField.value = paths[0];
                locationField.blur();
            }
        });
    }

    const backupBtn = document.getElementById('backupButton');
    const overlay = document.getElementById('overlay');
    backupBtn.onclick = () => {
        if(locationField.value === '') {
            alertify.error('You must enter a valid backup location.');
            return;
        }
                
        // Create a folder for the notes.
        const path = locationField.value + '/Noteworthy';
        fs.mkdir(path, () => {
            // Write files for each note to this folder.
            const localDatabase = fs.readFileSync(`${__dirname}/Database.json`);
            const fileName = path + '/NoteworthyBackup' + Date.now() + '.json';
            fs.writeFileSync(fileName, JSON.stringify(localDatabase), 'utf8');

            hideBackupAlert(root);
            alertify.success('All notebooks and notes were backed up successfully!');
        });
    }
    overlay.onclick = () => {
        hideBackupAlert(root);
    }
}

/** Hides the backup alert. */
const hideBackupAlert = (root) => {
    const alert = document.getElementById('backupAlert');
    const overlay = document.getElementById('overlay');
    root.removeChild(alert);
    root.removeChild(overlay);
}

/** Shows the share alert. */
const showShareAlert = (root, note, noteHTML) => {
    const alert = fs.readFileSync(`${__dirname}/src/html/Alerts/ShareAlert.html`, 'utf8');
    $('#root').prepend(alert);

    const shareBtn = document.getElementById('shareButton');

    const fromField = document.getElementById('shareFromField');
    const passwordField = document.getElementById('sharePasswordField');
    const toField = document.getElementById('shareToField');
    const overlay = document.getElementById('overlay');
    
    if(firebase.auth().currentUser) {
        const user = firebase.auth().currentUser;
        fromField.value = `${user.email}`;
    }

    shareBtn.onclick = () => {
        if(fromField.value === '' || passwordField.value === '' || toField.value === '') {
            alertify.error('You must enter an email and password to share a note.');
            return;
        }

        const transport = nodemailer.createTransport({
            service: 'Gmail',
            secure: 'false',
            auth: {
                user: fromField.value,
                pass: passwordField.value,
            },
            tls: {
                rejectUnauthorized: false,
            }
        });
        transport.verify((err, success) => {
            if(err) {
                alertify.error('You are not able to send an email from this app due to your current email security rules');
                return;
            }

            transport.sendMail({
                from: fromField.value,
                to: toField.value,
                subject: note.title,
                text: note.content,
                html: noteHTML
            }, (err2) => {
                if(err2) { alertify.error('There was an error sharing this note'); return; }
                alertify.success(`Shared ${note.title} with ${toField.value}!`);
            })
        });
        hideShareAlert(root);
    }
    overlay.onclick = () => {
        hideShareAlert(root);
    }
}

/** Hides the share alert. */
const hideShareAlert = (root) => {
    const alert = document.getElementById('shareAlert');
    const overlay = document.getElementById('overlay');
    root.removeChild(alert);
    root.removeChild(overlay);
}

/** Shows the account alert. */
const showAccountAlert = (root, logoutFunc) => {
    const alert = fs.readFileSync(`${__dirname}/src/html/Alerts/AccountAlert.html`, 'utf8');
    $('#root').prepend(alert);

    const resetBtn = document.getElementById('sendResetButton');
    const logoutBtn = document.getElementById('logoutButton');

    const emailField = document.getElementById('accountEmailField');
    const _ = document.getElementById('accountPasswordField');
    const overlay = document.getElementById('overlay');
    
    if(firebase.auth().currentUser) {
        const user = firebase.auth().currentUser;
        emailField.value = `${user.email}`;
    }

    resetBtn.onclick = () => {
        firebase.auth().sendPasswordResetEmail(emailField.value);
        hideAccountAlert(root);
        alertify.success('Sent password reset email!');
    }
    logoutBtn.onclick = () => {
        logoutFunc();
        hideAccountAlert(root);
    }
    overlay.onclick = () => {
        hideAccountAlert(root);
    }
}

/** Hides the account alert. */
const hideAccountAlert = (root) => {
    const alert = document.getElementById('accountAlert');
    const overlay = document.getElementById('overlay');
    root.removeChild(alert);
    root.removeChild(overlay);
}

/** Shows the create new alert. */
const showCreateNewAlert = (root, newWhat = 'Notebook', then) => {
    const alert = fs.readFileSync(`${__dirname}/src/html/Alerts/CreateNew.html`, 'utf8');
    $('#root').prepend(alert);

    const title = document.getElementById('createTitle');
    const createBtn = document.getElementById('createNewButton');
    const desc = document.getElementById('createNewDescription');
    title.innerHTML = `New ${newWhat}`;
    createBtn.innerHTML = `Create New ${newWhat}`;
    desc.innerHTML = `Enter a name for your new ${newWhat.toLowerCase()}`;

    const titleField = document.getElementById('createNewField');
    const overlay = document.getElementById('overlay');
    createBtn.onclick = () => {
        then(titleField.value);
        hideCreateNewAlert(root);
    }
    overlay.onclick = () => {
        hideCreateNewAlert(root);
    }
}

/** Hides the create new alert. */
const hideCreateNewAlert = (root) => {
    const alert = document.getElementById('createNewAlert');
    const overlay = document.getElementById('overlay');
    root.removeChild(alert);
    root.removeChild(overlay);
}

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
        alertify.success('Sent password reset email!');
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


    /** Creates a random ID for notebooks and notes. */
    randomID: () => {
        return '_' + Math.random().toString(36).substr(2, 15);
    },


    /** Log out of firebase account. */
    logout: (success, failure) => {
        firebase.auth().signOut().then(() => success()).catch((err) => failure(err));
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

    /** Shows the create new alert. */
    showCreateNewAlert: showCreateNewAlert,

    /** Hides the create new alert. */
    hideCreateNewAlert: hideCreateNewAlert,

    /** Shows the account alert. */
    showAccountAlert: showAccountAlert,

    /** Hides the account alert. */
    hideAccountAlert: hideAccountAlert,

    /** Shows the share alert. */
    showShareAlert: showShareAlert,

    /** Hides the account alert. */
    hideShareAlert: hideShareAlert,

    /** Shows the backup alert. */
    showBackupAlert: showBackupAlert,

    /** Hides the backup alert. */
    hideBackupAlert: hideBackupAlert,

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
            preview.innerHTML = `${val.content.length === 0 ? '*No Content*' : val.content}`;
            cell.appendChild(title);
            cell.appendChild(preview);
            cell.onclick = () => {
                onClick(val);   
            };
            return cell;
        })
    }
}