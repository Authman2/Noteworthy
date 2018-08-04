const fs = require('fs');
const $ = require('jquery');
const firebase = require('firebase');
const alertify = require('alertify.js');
const nodemailer = require('nodemailer');
const remote = require('electron').remote;
const BrowserWindow = remote.BrowserWindow;
var hljs = require('highlight.js');
const turndown = require('turndown');
const markDownOnIt = require('markdown-it');
const Moment = require('moment');

const config = require(__dirname + '/creds.json');
firebase.initializeApp(config);

// Find and Replace.
var findIndex = 0;

// Replace all on strings.
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

const tdService = new turndown();
tdService.addRule('', {
    filter: 'mark',
    replacement: function(content) {
        return `==${content}==`
    }
})
tdService.addRule('', {
    filter: 'u',
    replacement: function(content) {
        return `<u>${content}</u>`
    }
})
tdService.addRule('', {
    filter: 'strike',
    replacement: function(content) {
        return `~~${content}~~`
    }
})
tdService.addRule('', {
    filter: 'sub',
    replacement: function(content) {
        return `~${content}~`
    }
})
tdService.addRule('', {
    filter: 'sup',
    replacement: function(content) {
        return `^${content}^`
    }
})
tdService.addRule('', {
    filter: 'br',
    replacement: function(content) {
        return `<br>`;
    }
})
tdService.addRule('', {
    filter: 'span',
    replacement: function(content) {
        return `==${content}==`;
    }
})
// tdService.addRule('', {
//     filter: 'input',
//     replacement: function(content) {
//         return `[ ] ${content}`;
//     }
// })
const mdOnIt = new markDownOnIt({
    html: true,
    breaks: true,
    highlight: function(str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(lang, str).value;
            } catch (__) {}
        }
        return '';
    }
});
mdOnIt.use(require('markdown-it-mark'));
mdOnIt.use(require('markdown-it-sub'));
mdOnIt.use(require('markdown-it-sup'));
// mdOnIt.use(require('markdown-it-checkbox'));




/** Shows the account alert. */
const showConfirmAlert = (root, title, yes) => {
    const alert = fs.readFileSync(`${__dirname}/src/html/Alerts/ConfirmAlert.html`, 'utf8');
    $('#root').prepend(alert);

    const titleField = document.getElementById('confirmAlertTitle');
    const yesBtn = document.getElementById('confirmYesButton');
    const noBtn = document.getElementById('confirmNoButton');

    titleField.innerHTML = `${title}`;
    yesBtn.onclick = () => {
        yes();
        hideConfirmAlert(root);
    }
    noBtn.onclick = () => {
        hideConfirmAlert(root);
    }
    overlay.onclick = () => {
        hideConfirmAlert(root);
    }
}

/** Hides the account alert. */
const hideConfirmAlert = (root) => {
    const alert = document.getElementById('confirmAlert');
    const overlay = document.getElementById('overlay');
    root.removeChild(alert);
    root.removeChild(overlay);
}

/** Shows the find replace alert. */
const showFindReplaceAlert = (root, content, contentField, then, replaceFunc) => {
    const alert = fs.readFileSync(`${__dirname}/src/html/Alerts/FindReplace.html`, 'utf8');
    $('#root').prepend(alert);

    const frWindow = document.getElementById('findReplaceAlert');
    frWindow.offsetTop = 270;
    findIndex = 0;

    const closeBtn = document.getElementById('closeFindReplaceButton');
    const findField = document.getElementById('findField');
    const replaceField = document.getElementById('replaceField');

    const previousBtn = document.getElementById('previousButton');
    const nextBtn = document.getElementById('nextButton');
    const replaceBtn = document.getElementById('replaceButton');
    const replaceAllBtn = document.getElementById('replaceAllButton');

    closeBtn.onclick = () => {
        contentField.innerHTML = mdOnIt.render(content);
        hideFindReplaceAlert(root);
        then();
    }
    previousBtn.onclick = () => {
        const search = findField.value;
        var copy = content;
        
        // 1.) Get the next index of the search starting from the end
        // of the previous search.
        const foundIndex = content.substring(0,findIndex).lastIndexOf(search, findIndex);
        const endIndex = foundIndex + search.length;
        findIndex = foundIndex+1;
        
        // 2.) Once you have the index, edit the content field and run
        // the callback with the edited markdown so that it can be
        // rendered in the content area.
        copy = `${copy.substring(0, foundIndex)}<mark id='findReplaceHighlight'>${copy.substring(foundIndex, endIndex)}</mark>${copy.substring(endIndex)}`;
        contentField.innerHTML = mdOnIt.render(copy);

        // 3.) Scroll to that element.
        const element = document.getElementById('findReplaceHighlight');
        if(element) {
            const elementTop = element.offsetTop;
            contentField.scrollTop = elementTop - 50;
        }
    }
    nextBtn.onclick = () => {
        const search = findField.value;
        var copy = content;
        
        // 1.) Get the next index of the search starting from the end
        // of the previous search.
        const foundIndex = content.indexOf(search, findIndex);
        const endIndex = foundIndex + search.length;
        findIndex = foundIndex+1;
        
        // 2.) Once you have the index, edit the content field and run
        // the callback with the edited markdown so that it can be
        // rendered in the content area.
        copy = `${copy.substring(0, foundIndex)}<mark id='findReplaceHighlight'>${copy.substring(foundIndex, endIndex)}</mark>${copy.substring(endIndex)}`;
        contentField.innerHTML = mdOnIt.render(copy);

        // 3.) Scroll to that element.
        const element = document.getElementById('findReplaceHighlight');
        if(element) {
            const elementTop = element.offsetTop;
            contentField.scrollTop = elementTop - 50;
        }
    }
    replaceBtn.onclick = () => {
        const replace = replaceField.value;
        
        // 1.) Get the string at the find index. Then replace it with
        // the replace text. Only do this is there is a highlighted element.
        const element = document.getElementById('findReplaceHighlight');
        if(!element) return;

        // 2.) Replace the content string and refresh the content field.
        content = `${content.substring(0, findIndex-1)}${replace}${content.substring(findIndex + element.innerHTML.length)}`;
        contentField.innerHTML = mdOnIt.render(content);
        replaceFunc(content);
    }
    replaceAllBtn.onclick = () => {
        const replace = replaceField.value;
        
        // 1.) Get the string at the find index. Then replace it with
        // the replace text. Only do this is there is a highlighted element.
        const element = document.getElementById('findReplaceHighlight');
        if(!element) return;

        // 2.) Replace the content string and refresh the content field.
        content = content.replaceAll(element.innerHTML, replace);
        contentField.innerHTML = mdOnIt.render(content);
        replaceFunc(content);
    }
}

/** Hides the find replace alert. */
const hideFindReplaceAlert = (root) => {
    const alert = document.getElementById('findReplaceAlert');
    alert.style.bottom = '0px';
    alert.style.opacity = '0';
    setTimeout(() => {
        root.removeChild(alert);
    }, 100);
}

/** Shows the backup alert. */
const showBackupAlert = (root, dataToSave) => {
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
            }
            locationField.blur();
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
            const localDatabase = dataToSave;
            const fileName = path + '/NoteworthyBackup' + Date.now() + '.nbackup';
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
    titleField.focus();
    titleField.onkeydown = (e) => {
        if(e.keyCode === 13) {
            if(titleField.value === '') {
                alertify.error(`You must enter a non-empty name for your ${newWhat.toLowerCase()}`);
                return;
            }
            then(titleField.value);
            hideCreateNewAlert(root);
        }
    }
    createBtn.onclick = () => {
        if(titleField.value === '') {
            alertify.error(`You must enter a non-empty name for your ${newWhat.toLowerCase()}`);
            return;
        }
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
    const sendEmailBtn = document.getElementById('sendPasswordResetButton');
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
        firebase.auth().signOut()
                            .then(() => { success() })
                            .catch((err) => { failure(err) });
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

    /** Shows the find replace alert. */
    showFindReplaceAlert: showFindReplaceAlert,

    /** Hides the find replace alert. */
    hideFindReplaceAlert: hideFindReplaceAlert,

    /** Shows the confirm alert. */
    showConfirmAlert: showConfirmAlert,

    /** Hides the confirm alert. */
    hideConfirmAlert: hideConfirmAlert,


    /** Maps an array of notebooks to notebook table cells. */
    mapNotebookToTableCell: (notebooks, onClick) => {
        return notebooks.map((val, _, __) => {
            const cell = document.createElement('div');
            const title = document.createElement('p');
            const created = document.createElement('p');
            const pages = document.createElement('p');
            cell.setAttribute('notebookID', val.id);
            cell.className = 'notebooksTableCell';
            title.className = 'notebooksTableCellTitleLabel';
            created.className = 'notebooksTableCellCreateLabel';
            pages.className = 'notebooksTableCellPagesLabel';
            title.innerHTML = `${val.title}`;
            const dString = Moment({
                                year: val.created[0],
                                month: val.created[1],
                                day: val.created[2],
                                hours: val.created[3],
                                minutes: val.created[4],
                                seconds: val.created[5]
                            }).toString();
            created.innerHTML = `${dString.substring(0, dString.length - 3)}`;
            pages.innerHTML = `Pages: ${val.pages.length}`;
            cell.appendChild(title);
            cell.appendChild(created);
            cell.appendChild(pages);
            cell.onclick = () => {
                // Close all others.
                const othersList = document.getElementsByClassName('noteTableCell');
                const others = Array.prototype.slice.call(othersList);
                for(var i in others) { others[i].style.right = '0px'; }

                onClick(val);   
            };
            cell.onmousewheel = (e) => {
                if(e.deltaX < -20) {
                    cell.style.right = '100px';

                    // Close all others.
                    const othersList = document.getElementsByClassName('noteTableCell');
                    const others = Array.prototype.slice.call(othersList);
                    const open = others.filter((val2, _, __) => {
                        return val2.style.right === '100px' && val2.getAttribute('noteID') !== val.id
                    });
                    for(var i in open) { open[i].style.right = '0px'; }
                } else if(e.deltaX > 20) {
                    cell.style.right = '0px';
                }
            }
            return cell;
        })
    },

    /** Maps an array of notes to note table cells. */
    mapNoteToTableCell: (notebooks, onClick) => {
        return notebooks.map((val, _, __) => {
            const cell = document.createElement('div');
            const title = document.createElement('p');
            const preview = document.createElement('p');
            cell.setAttribute('noteID', val.id);
            cell.className = 'noteTableCell';
            title.className = 'noteTableCellTitleLabel';
            preview.className = 'noteTableCellPreviewLabel';
            title.innerHTML = `${val.title}`;
            preview.innerHTML = `${val.content.length === 0 ? '*No Content*' : val.content}`;
            cell.appendChild(title);
            cell.appendChild(preview);
            cell.onclick = () => {
                // Close all others.
                const othersList = document.getElementsByClassName('noteTableCell');
                const others = Array.prototype.slice.call(othersList);
                for(var i in others) { others[i].style.right = '0px'; }

                onClick(val);   
            };
            cell.onmousewheel = (e) => {
                if(e.deltaX < -20) {
                    cell.style.right = '100px';

                    // Close all others.
                    const othersList = document.getElementsByClassName('noteTableCell');
                    const others = Array.prototype.slice.call(othersList);
                    const open = others.filter((val2, _, __) => {
                        return val2.style.right === '100px' && val2.getAttribute('noteID') !== val.id
                    });
                    for(var i in open) { open[i].style.right = '0px'; }
                } else if(e.deltaX > 20) {
                    cell.style.right = '0px';
                }
            }
            return cell;
        })
    },


    /** Maps a single note to a note table cell. */
    mapOneNoteToTableCell: (val, onClick) => {
        const cell = document.createElement('div');
        const title = document.createElement('p');
        const preview = document.createElement('p');
        cell.setAttribute('noteID', val.id);
        cell.className = 'noteTableCell';
        title.className = 'noteTableCellTitleLabel';
        preview.className = 'noteTableCellPreviewLabel';
        title.innerHTML = `${val.title}`;
        preview.innerHTML = `${val.content.length === 0 ? '*No Content*' : val.content}`;
        cell.appendChild(title);
        cell.appendChild(preview);
        cell.onclick = () => {
            // Close all others.
            const othersList = document.getElementsByClassName('noteTableCell');
            const others = Array.prototype.slice.call(othersList);
            for(var i in others) { others[i].style.right = '0px'; }

            onClick(val);   
        };
        cell.onmousewheel = (e) => {
            if(e.deltaX < -20) {
                cell.style.right = '100px';

                // Close all others.
                const othersList = document.getElementsByClassName('noteTableCell');
                const others = Array.prototype.slice.call(othersList);
                const open = others.filter((val2, _, __) => {
                    return val2.style.right === '100px' && val2.getAttribute('noteID') !== val.id
                });
                for(var i in open) { open[i].style.right = '0px'; }
            } else if(e.deltaX > 20) {
                cell.style.right = '0px';
            }
        }
        return cell;
    },


    /** Adds actions behind a cell. */
    addCellActions: (top, tableCell, onDelete) => {
        const cell = document.createElement('div');
        const del = document.createElement('div');
        cell.className = 'actionTableCell';
        del.className = 'actionTableCellOption';
        del.innerHTML = 'Delete';
        cell.appendChild(del);
        cell.style.top = top;
        cell.onclick = () => {
            onDelete(tableCell);
        }
        cell.onmousewheel = (e) => {
            if(e.deltaX >= 0) {
                tableCell.style.right = '0px';
            }
        }
        return cell;
    },


    /** Displays the context menu at the selection point. */
    showContextMenu: (root, e) => {
        const existing = document.getElementById('contextMenu');
        if(existing) root.removeChild(existing);

        const alert = fs.readFileSync(`${__dirname}/src/html/ContextMenu.html`, 'utf8');
        $('#root').prepend(alert);

        const boldBtn = document.getElementById('boldBtn');
        const italicBtn = document.getElementById('italicBtn');
        const underlineBtn = document.getElementById('underlineBtn');
        const strikeBtn = document.getElementById('strikethroughBtn');
        const subscriptBtn = document.getElementById('subscriptBtn');
        const superscriptBtn = document.getElementById('superscriptBtn');
        const bulletedListBtn = document.getElementById('bulletedListBtn');
        const numberedListBtn = document.getElementById('numberedListBtn');
        const todoList = document.getElementById('todoBtn');
        const codeBtn = document.getElementById('codeBtn');
        const highlightBtn = document.getElementById('highlightBtn');
        const unhighlightBtn = document.getElementById('unhighlightBtn');
        boldBtn.onclick = () => { BrowserWindow.getFocusedWindow().emit('bold'); }
        italicBtn.onclick = () => { BrowserWindow.getFocusedWindow().emit('italic'); }
        underlineBtn.onclick = () => { BrowserWindow.getFocusedWindow().emit('underline'); }
        strikeBtn.onclick = () => { BrowserWindow.getFocusedWindow().emit('strikethrough'); }
        subscriptBtn.onclick = () => { BrowserWindow.getFocusedWindow().emit('subscript'); }
        superscriptBtn.onclick = () => { BrowserWindow.getFocusedWindow().emit('superscript'); }
        bulletedListBtn.onclick = () => { BrowserWindow.getFocusedWindow().emit('bulleted-list'); }
        numberedListBtn.onclick = () => { BrowserWindow.getFocusedWindow().emit('numbered-list'); }
        todoList.onclick = () => { BrowserWindow.getFocusedWindow().emit('todo-list'); }
        codeBtn.onclick = () => { BrowserWindow.getFocusedWindow().emit('code-segment'); }
        highlightBtn.onclick = () => { BrowserWindow.getFocusedWindow().emit('highlight'); }
        unhighlightBtn.onclick =  () => { BrowserWindow.getFocusedWindow().emit('unhighlight'); }

        const wind = document.getElementById('contextMenu');
        wind.style.top = `${e.clientY - 10}px`;
        wind.style.left = `${e.clientX - 37.5}px`;
    },


    /** Hides the context menu. */
    hideContextMenu: (root) => {
        const alert = document.getElementById('contextMenu');
        if(alert) root.removeChild(alert);
    },


    /** Shows the diffing alert view. */
    showDiffingAlert: (title, then) => {
        const alert = fs.readFileSync(`${__dirname}/src/html/Alerts/DiffAlert.html`, 'utf8');
        $('#root').prepend(alert);

        const diffTitle = document.getElementById('diff-alert-note-title');
        const localBtn = document.getElementById('diff-alert-local-button');
        const syncBtn = document.getElementById('diff-alert-sync-button');
        diffTitle.innerHTML = title;

        localBtn.onclick = () => {
            then();
        }
        syncBtn.onclick = () => {
            then();
        }
    },


    /** Converts an HTML string into a Markdown string. */
    toMarkDown: (html) => {
        const _html = html.replace(/<input class="checkbox" type="checkbox">/g, '[ ] ')
                        .replace(/<input class="checkbox" id="checkbox[0-9]*" type="checkbox">/g, '[ ] ')
                        .replace(/<input class="checkbox" type="checkbox" checked="false">/g, '[ ] ')
                        .replace(/<input class="checkbox" type="checkbox" checked="true">/g, '[x] ');
        const ret = tdService.turndown(_html);
        return ret;
    },


    /** Converts a Markdown string into HTML. */
    toHTML: (md) => {
        const ret = mdOnIt.render(md)
                    .replace(/<mark>/g, '<span style="background-color: yellow;">')
                    .replace(/<\/mark>/g, '</span>')
                    .replace(/id="checkbox[0-9]*"/g, '')
                    .replace(/\[ \] /g, '<input class="checkbox" type="checkbox"> ')
                    .replace(/\[x\] /g, '<input class="checkbox" type="checkbox" checked="true"> ');
        return ret;
    }
}