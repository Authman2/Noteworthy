const fs = require('fs');
const $ = require('jquery');
const firebase = require('firebase');
const alertify = require('alertify.js');
const nodemailer = require('nodemailer');
const remote = require('electron').remote;
const BrowserWindow = remote.BrowserWindow;
const Moment = require('moment');
const { dialog } = require('electron').remote;
const turndown = require('turndown');

const config = require(__dirname + '/creds.json');
firebase.initializeApp(config);

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


    /** Shows the new alert. */
    showNewAlert: (body, then) => {
        $('.action-alert').remove();

        const file = fs.readFileSync(__dirname + '/src/html/alerts/NewAlert.html', 'utf8');
        const div = document.createElement('div');
        div.innerHTML = file;
        body.appendChild(div.firstChild);

        const titleField = document.getElementById('new-alert-input');
        const notebookOption = document.getElementById('new-alert-notebook-option');
        const noteOption = document.getElementById('new-alert-note-option');
        const submitButton = document.getElementById('new-alert-submit');
        const closeButton = document.getElementsByClassName('new-alert-close')[0];

        submitButton.innerHTML = 'Create Notebook';
        noteOption.style.backgroundColor = 'white';
        noteOption.style.border = '1px solid #60A4EB';
        noteOption.style.color = '#60A4EB';

        titleField.oninput = () => {
            if(titleField.value === '') {
                submitButton.style.opacity = '0.4';
                submitButton.disabled = true;
                submitButton.style.cursor = 'default';
            } else {
                submitButton.style.opacity = '1';
                submitButton.disabled = false;
                submitButton.style.cursor = 'pointer';
            }
        }
        titleField.oninput();

        notebookOption.onclick = () => {
            noteOption.style.backgroundColor = 'white';
            noteOption.style.border = '1px solid #60A4EB';
            noteOption.style.color = '#60A4EB';
            notebookOption.style.backgroundColor = '#60A4EB';
            notebookOption.style.border = 'unset';
            notebookOption.style.color = 'white';
            submitButton.innerHTML = 'Create Notebook';
        }
        noteOption.onclick = () => {
            notebookOption.style.backgroundColor = 'white';
            notebookOption.style.border = '1px solid #60A4EB';
            notebookOption.style.color = '#60A4EB';
            noteOption.style.backgroundColor = '#60A4EB';
            noteOption.style.border = 'unset';
            noteOption.style.color = 'white';
            submitButton.innerHTML = 'Create Note';
        }
        closeButton.onclick = () => {
            const objs = document.getElementsByClassName('new-alert');
            for(var i = 0; i < objs.length; i++) {
                objs[i].remove();
            }
        }
        submitButton.onclick = () => {
            if(notebookOption.style.backgroundColor !== 'white') { then(0, titleField.value); }
            else { then(1, titleField.value); }
            const objs = document.getElementsByClassName('new-alert');
            for(var i = 0; i < objs.length; i++) {
                objs[i].remove();
            }
        }
    },


    /** Shows the share alert. */
    showShareAlert: (body, title, content, then) => {
        $('.action-alert').remove();

        const file = fs.readFileSync(__dirname + '/src/html/alerts/ShareAlert.html', 'utf8');
        const div = document.createElement('div');
        div.innerHTML = file;
        body.appendChild(div.firstChild);

        const textBtn = document.getElementById('share-alert-text');
        const mdBtn = document.getElementById('share-alert-md');
        const htmlBtn = document.getElementById('share-alert-html');
        const closeButton = document.getElementsByClassName('share-alert-close')[0];

        textBtn.onclick = () => {
            const toExport = content;
            dialog.showSaveDialog(null, {
                title: `${title}.txt`,
                filters: [{name: 'txt', extensions: ['txt']}]
            }, (filename) => {
                fs.writeFileSync(filename, toExport, 'utf8');
                then(filename);
            });
        }
        mdBtn.onclick = () => {
            const _html = content.replace(/<input class="checkbox" type="checkbox">/g, '[ ] ')
                        .replace(/<input class="checkbox" id="checkbox[0-9]*" type="checkbox">/g, '[ ] ')
                        .replace(/<input class="checkbox" type="checkbox" checked="false">/g, '[ ] ')
                        .replace(/<input class="checkbox" type="checkbox" checked="true">/g, '[x] ');
            const md = tdService.turndown(_html);
            const toExport = md;
            dialog.showSaveDialog(null, {
                title: `${title}.md`,
                filters: [{name: 'md', extensions: ['md']}]
            }, (filename) => {
                fs.writeFileSync(filename, toExport, 'utf8');
                then(filename);
            });
        }
        htmlBtn.onclick = () => {
            const toExport = content;
            dialog.showSaveDialog(null, {
                title: `${title}.html`,
                filters: [{name: 'html', extensions: ['html']}]
            }, (filename) => {
                fs.writeFileSync(filename, toExport, 'utf8');
                then(filename);
            });
        }
        closeButton.onclick = () => {
            const objs = document.getElementsByClassName('share-alert');
            for(var i = 0; i < objs.length; i++) {
                objs[i].remove();
            }
        }
    }

    
}