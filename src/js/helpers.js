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
                fireRef.child('users').child(user.uid).once('value', (snap) => {
                    const a = {
                        firstName: snap.val().firstName,
                        lastName: snap.val().lastName,
                        uid: snap.val().uid
                    }
                    global.currentUser = a;
                    loadNotesMethod(global.currentUser.uid);
                })
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
    }
};