const $ = require('jquery');
const fs = require('fs');
const alertify = require('alertify.js');
const global = require('electron').remote.getGlobal('sharedObject');

/** Just a module of helper functions and things that are just, in general,
* widely used or could be used anywhere in the app. */
module.exports = {

    /** Checks if a value exists for a given element. */
    valueExists: (element) => {
        if(element === undefined || element === null) return false;
        if(element === '' || element === ' ') return false;
        return true;
    },

    /** Shows the prompt dialog from alertify.js */
    showPromptDialog: (message, acceptTitle, declineTitle, success) => {
        alertify.okBtn(acceptTitle).cancelBtn(declineTitle)
        .confirm(message, function (ev) {
            ev.preventDefault();
            success();
        }, function(ev) {
            ev.preventDefault();
        });
    },

    /** Checks if the key pressed is not a special key */
    isSpecialKey: (element) => {
        if(element === 'ShiftLeft' || element === 'MetaLeft' || element === 'Space' || element === 'Backspace'
        || element === 'ShiftRight' || element === 'MetaRight') {
            return true;
        }
        return false;
    },

    /** Returns the current note as a JSON object. */
    getCurrentNote: (notebooks) => {
        if(global.currentID !== null && global.currentID !== '') {
            for(var i = 0; i < notebooks.length; i++) {
                if(notebooks[i].id === global.currentID) {
                    return notebooks[i];
                }
            }
        } else {
            return {
                id: '',
                title: 'New',
                content: '',
                creator: '',
                timestamp: 0
            };
        }
    },

    /** Deletes a note from the database. */
    deleteNote: (noteID, fireRef) => {
        fireRef.child('notes').child(noteID).remove();
        document.getElementById('titleArea').value = '';
        document.getElementById('noteArea').innerHTML = '';
    },

    /** Handles automatically logging in a user that is already signed in. */
    autoLogin: (fireAuth, fireRef, loadNotesMethod) => {
        fireAuth.onAuthStateChanged((user) => {
            if (user) {
                const a = {
                    uid: user.uid
                }
                global.currentUser = a;
                loadNotesMethod(global.currentUser.uid);
            } else { return; }
        });
    },

    // Always makes sure the caret is at the end of the text input.
    placeCaretAtEnd: (el) => {
        el.focus();
        if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
            var range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } else if (typeof document.body.createTextRange != "undefined") {
            var textRange = document.body.createTextRange();
            textRange.moveToElementText(el);
            textRange.collapse(false);
            textRange.select();
        }
    },


    // Checks if the database already contains a note with the given id.
    databaseContains: (id, fireRef, containsNote, doesNotContainNote) => {
        fireRef.child('notes').once('value', (snap) => {
            if(snap.hasChild(id)) {
                containsNote();
            } else {
                doesNotContainNote();
            }
        })
    },


    // Updates an existing note in the database.
    updateNote: (newData, fireRef) => {
        fireRef.child('notes').child(newData.id).update(newData);
    },


    // Creates a new note from JSON data. Also returns the data so it can be used locally.
    createNewNote: (data, path, fireRef) => {
        const ref = fireRef.child('notes').push();
        data.id = ref.key;
        ref.set(data);

        // Don't forget to change the id in the backup file so that it doesn't try to create multiple copies.
        fs.writeFileSync(path, JSON.stringify(data), 'utf8');

        return data;
    },


    // Finds the input text in a content editable div. Literally just an implementation of the
    // "find" feature in many text editors.
    findInText: (words) => {
        const inText = $('#noteArea');
        var html = inText.html().replace(/<\/?strong>/gi, '');
        var text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
        var exp;

        $.each(words, (i, word) => {
            exp = new RegExp('\\b(' + word + ')\\b', 'gi');
            html = html.replace(exp, (m) => {
                return `<span class='find-highlight'>${m}</span>`
            });
        });
        inText.html(html);
    },


    // Checks if a string contains at least one character.
    containsLetter: (input) => {
        return input.includes('a') || input.includes('b') || input.includes('c') ||
        input.includes('d') || input.includes('e') || input.includes('f') || input.includes('g')
        || input.includes('h') || input.includes('i') || input.includes('j') || input.includes('k')
        || input.includes('l') || input.includes('m') || input.includes('n') || input.includes('o')
        || input.includes('p') || input.includes('q') || input.includes('r') || input.includes('s')
        || input.includes('t') || input.includes('u') || input.includes('v') || input.includes('w')
        || input.includes('x') || input.includes('y') || input.includes('z')
        || input.includes('A') || input.includes('B') || input.includes('C') ||
        input.includes('D') || input.includes('E') || input.includes('F') || input.includes('G')
        || input.includes('H') || input.includes('I') || input.includes('J') || input.includes('K')
        || input.includes('L') || input.includes('M') || input.includes('N') || input.includes('O')
        || input.includes('P') || input.includes('Q') || input.includes('R') || input.includes('S')
        || input.includes('T') || input.includes('U') || input.includes('V') || input.includes('W')
        || input.includes('X') || input.includes('Y') || input.includes('Z')
    },


    // Creates a DOM object for a row of data in the notes view.
    createNoteViewNode: (notebook) => {
        const highlightedColor = 'orange';
        const normalColor = 'rgb(57, 168, 45)';

        const row = document.createElement('div');
        row.className = 'row';

        const title = document.createElement('h4');
        const createdLabel = document.createElement('p');

        title.innerHTML = notebook.title;
        createdLabel.innerHTML = 'Created ' + notebook.timestamp;

        row.onclick = () => {
            if(row.style.backgroundColor === backgroundColor) {
                row.style.backgroundColor = highlightedColor;
            } else {
                row.style.backgroundColor = normalColor;
            }

        }

        row.appendChild(title);
        row.appendChild(createdLabel);
        return row;
    }
};