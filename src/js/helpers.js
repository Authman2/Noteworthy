const $ = require('jquery');
const fs = require('fs');
const alertify = require('alertify.js');
const global = require('electron').remote.getGlobal('sharedObject');
const moment = require('moment');


const shadeFunc = (color, percent) => {
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}
const shadeRGBColor = (color, percent) => {
    var f=color.split(","),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=parseInt(f[0].slice(4)),G=parseInt(f[1]),B=parseInt(f[2]);
    return "rgb("+(Math.round((t-R)*p)+R)+","+(Math.round((t-G)*p)+G)+","+(Math.round((t-B)*p)+B)+")";
}
const shadeUniv = (color, percent) => {
    if (color.length > 7 ) return shadeRGBColor(color,percent);
    else return shadeFunc(color,percent);
}


const toDateString = (input) => {
    var d = moment(input);
    return d.format('MMMM Do YYYY, h:mm:ss a');
}


/** Just a module of helper functions and things that are just, in general,
* widely used or could be used anywhere in the app. */
module.exports = {
    
    /** Checks if a value exists for a given element. */
    valueExists: (element) => {
        if(element === undefined || element === null) return false;
        if(element === '' || element === ' ') return false;
        return true;
    },

    /** Shades a color. */
    shade: shadeUniv,

    /** Shows the prompt dialog from alertify.js */
    showPromptDialog: (message, acceptTitle, declineTitle, appSettings, success) => {
        const div = document.createElement('div');
        div.id = 'promptDialog';
        div.className = 'nModal';
        div.style.display = 'block';
        div.style.zIndex = 5;
        div.style.position = 'fixed';
        div.style.left = 0;
        div.style.top = 0;
        div.style.width = '100%';
        div.style.height = '100%';
        div.style.overflow = 'auto';
        div.style.paddingTop = '200px';
        div.style.backgroundColor = 'rgb(0,0,0)';
        div.style.backgroundColor = 'rgba(0,0,0,0.5)';

        const holder = document.createElement('div');
        holder.style.position = 'relative';
        holder.style.margin = 'auto';
        holder.style.padding = 20;
        holder.style.width = '65%';
        holder.style.height = '20%';
        holder.style.overflow = 'auto';
        holder.style.textAlign = 'center';
        holder.style.border = '1px solid #888';
        holder.style.animationDuration = '0.4s';
        holder.style.animationName = 'animatetop';
        holder.style.webkitAnimationDuration = '0.4s';
        holder.style.webkitAnimationName = 'animatetop';
        holder.style.backgroundColor = 'white';
        holder.style.boxShadow = '0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19)';

        const messageComp = document.createElement('p');
        messageComp.id = 'ga-message';
        messageComp.style.fontSize = '15px';
        messageComp.style.fontWeight = 100;
        messageComp.style.fontFamily = 'Avenir';

        const okBtn = document.createElement('button');
        okBtn.id = 'ga-ok-btn';
        okBtn.className = 'rect-button';
        okBtn.style.height = '35px';
        okBtn.style.fontSize = '14px';
        okBtn.style.backgroundColor = appSettings.noteViewFooterColor;

        const cancelBtn = document.createElement('button');
        cancelBtn.id = 'ga-cancel-btn';
        cancelBtn.className = 'rect-button';
        cancelBtn.style.height = '35px';
        cancelBtn.style.marginRight = '20px';
        cancelBtn.style.fontSize = '14px';
        cancelBtn.style.backgroundColor = appSettings.noteViewFooterColor;

        messageComp.innerHTML = message;
        okBtn.innerText = acceptTitle;
        cancelBtn.innerText = declineTitle;

        okBtn.onclick = () => { success(); div.remove(); }
        cancelBtn.onclick = () => { div.remove(); }

        okBtn.onmouseenter = () => { 
            okBtn.style.backgroundColor = shadeUniv(appSettings.noteViewFooterColor, -0.35);
        }
        cancelBtn.onmouseenter = () => { 
            cancelBtn.style.backgroundColor = shadeUniv(appSettings.noteViewFooterColor, -0.35);
        }
        okBtn.onmouseleave = () => { 
            okBtn.style.backgroundColor = appSettings.noteViewFooterColor;
        }
        cancelBtn.onmouseleave = () => { 
            cancelBtn.style.backgroundColor = appSettings.noteViewFooterColor;
        }

        holder.appendChild(messageComp);
        holder.appendChild(cancelBtn);
        holder.appendChild(okBtn);
        div.appendChild(holder);

        document.getElementById('root').appendChild(div);
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
    // Takes in a function to run when trying to open a note.
    createNoteViewNode: (notebook, index, appSettings, openFunc) => {
        const color = '#77CC8B';
        const row = document.createElement('div');
        row.className = 'row';
        row.style.backgroundColor = appSettings.noteViewRowColor;

        const titleCreatedHolder = document.createElement('div');
        titleCreatedHolder.style.display = 'table-cell';
        const title = document.createElement('h4');
        const createdLabel = document.createElement('p');

        const editStar = document.createElement('span');
        editStar.className = 'edit-star fa fa-star';

        title.innerHTML = notebook.title;
        createdLabel.innerHTML = 'Created ' + toDateString(notebook.timestamp);
        title.style.color = appSettings.noteViewTextColor;
        createdLabel.style.color = appSettings.noteViewTextColor;
        editStar.style.color = shadeUniv(appSettings.noteViewRowColor, -0.5);

        row.onclick = () => {
            switch(global.noteViewMode) {
                case 0:
                    openFunc();
                    break;
                case 1:
                    global.deleteIndex = index;
                    editStar.style.display = editStar.style.display === 'table-cell' ? 'none' : 'table-cell';
                    const rows = document.getElementsByClassName('edit-star');
                    if(rows.length > 0) {
                        for(var i in rows) {
                            if(i === index) continue;
                            if(rows[i].style === undefined) continue;
                            rows[i].style.display = 'none';
                        }
                    }
                    break;
            }
        }
        row.onmouseenter = () => {
            row.style.backgroundColor = shadeUniv(appSettings.noteViewRowColor, -0.15);
        }
        row.onmouseleave = () => {
            row.style.backgroundColor = appSettings.noteViewRowColor;
        }

        titleCreatedHolder.appendChild(title);
        titleCreatedHolder.appendChild(createdLabel);
        row.appendChild(titleCreatedHolder);
        row.appendChild(editStar);
        return row;
    }
};