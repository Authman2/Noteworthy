const fs = require('fs');
const $ = require('jquery');
const spectrum = require('spectrum-colorpicker');
const global = require('electron').remote.getGlobal('sharedObject');
const alertify = require('alertify.js');
const helpers = require('./helpers.js');
const remote = require('electron').remote;
const TurndownService = require('turndown');
const showdown  = require('showdown');
const jsPDF = require('jspdf');
const app = remote.app;
const {Menu, MenuItem} = remote;
const BrowserWindow = remote.BrowserWindow;

const turndown = new TurndownService();
const mdConverter = new showdown.Converter();
const doc = new jsPDF();


/** Returns the text nodes in a parent element. */
const getText = (el) => {
    var ret = "";
    var length = el.childNodes.length;
    for(var i = 0; i < length; i++) {
        var node = el.childNodes[i];
        if(node.nodeType != 8) {
            ret += node.nodeType != 1 ? node.nodeValue : getText(node);
        }
    }
    return ret;
 }

/** Everything is basically one big function that gets called by the renderer. */
module.exports = (body, titleBar, appSettings, fireAuth, fireRef, ipc, eventsAgain) => {

    // 1.) Start by populating the body with the HTML for the home page.
    // To do this, you will load that file with fs-extra, then place the
    // contents into the innerHTML of the body. Make sure you also clear out
    // whatever is currently there from the last page.
    body.innerHTML = '';
    const loadedPage = fs.readFileSync(__dirname + '/../html/home.html', 'utf8');
    const NoteView = fs.readFileSync(__dirname + '/../html/notes-view.html', 'utf8');
    body.innerHTML = titleBar + loadedPage + NoteView;
    
    /************************
    *                       *
    *       VARIABLES       *
    *                       *
    *************************/

    // Whether or not the notes dialog is open.
    var noteViewOpen = false;
    
    // The notebooks (and add notebook button) that are dislayed on the notebook slider.
    var notebooks = [{
        id: '',
        title: 'New',
        content: '',
        creator: '',
        timestamp: 0
    }];

    // The current writing settings. These don't change that much necessarily.
    var writingSettings = {
        color: 'black',
        fontSize: '16px',
        fontFamily: 'Avenir',
        highlighterOn: false,
        alignment: 'justfiyLeft',
        bold: false,
        underline: false,
        italic: false,
        bulletedList: false,
        numberedList: false
    }

    // The id of the note that you are currently looking at. If it is a new note, this should be
    // null. Otherwise, it will be a string.
    var currentNoteID = null;



    // Elements.
    const titleField = document.getElementById('titleArea');
    const noteField = document.getElementById('noteArea');

    // The button to open the notes
    const notesViewBtn = document.getElementById('view-notes-button');
    
    // The actual note view.
    const notesView = document.getElementById('notes-view-modal');

    // The scroll view that holds all of the notes.
    const notesScrollView = document.getElementById('nScrollView');



    /************************
    *                       *
    *       FUNCTIONS       *
    *                       *
    *************************/    

    /** Loads all of the notes for a given user. Loads them asyncronously. */
    const loadNotes = (uid) => {
        fireRef.child('notes').orderByChild('creator').equalTo(uid).on('child_added', (snap) => {
            var a = snap.val();
            //a.content = mdConverter.makeHtml(a.content);
            
            // Check for duplicates.
            for(var i = 0; i < notebooks.length; i++) { if(notebooks[i].id === a.id) { return; } }

            notebooks.push(a);
            notebooks = notebooks.sort((a,b) => { return a.timestamp - b.timestamp });
            setupNotesView();
        });
    }

    /** Sets up the notes view with all the notes. */
    const setupNotesView = () => {
        notesScrollView.innerHTML = '';
        for(var i in notebooks) {
            const notebook = notebooks[i];
            
            const node = helpers.createNoteViewNode();
            notesScrollView.appendChild(node);
        }
    }

    /** Checks if the user forgot to save before moving on to something else, like clicking 
    * another note or switching pages.
    */
    const forgotToSave = (titleField, noteField) => {
        const title = titleField.value;
        const content = noteField.innerHTML;

        if(currentNoteID !== null) {
            for(var i = 0; i < notebooks.length; i++) {
                if(notebooks[i].id === currentNoteID) {
                    if(notebooks[i].title !== title || notebooks[i].content !== content) {
                        return true;
                    }
                    break;
                }
            }
        } else {
            if(title !== '' || content !== '') return true;
            return false;
        }
        return false;
    }

    /** Handles saving a note to the database under a certain user. */
    const saveNote = (title, content) => {
        //const toMarkdown = turndown.turndown(content);

        // If null, save a new note. Otherwise, update the old one.
        if(currentNoteID === null) {
            const ref = fireRef.child('notes').push();
            const data = {
                id: ref.key,
                title: title,
                content: content,
                creator: global.currentUser.uid, // Assumes that a user is already logged in.
                timestamp: Date.now()
            }
            currentNoteID = ref.key;
            ref.set(data);
        } else {
            const data = {
                id: currentNoteID,
                title: title,
                content: content,
            }
            fireRef.child('notes').child(currentNoteID).update(data);
        }

        // Make sure to update the local copy.
        for(var i = 0; i < notebooks.length; i++) {
            if(notebooks[i].id === currentNoteID) {
                notebooks[i].title = title;
                notebooks[i].content = content;
                break;
            }
        }
        
        alertify.success('Saved!');
    }

    // Font selection and the find/replace
    const configureFontSelectorAndFindReplace = () => {
        const dialog = document.getElementById('fontDialog');
        const findRep = document.getElementById('findReplaceWindow');
        var foundIndex = 0;
        var found;
        
        const selector = document.getElementById('fontSelector');
        const options = document.getElementsByTagName('option');
        const sizeInput = document.getElementById('fontSizeSelector');

        const saveBtn = document.getElementById('saveFontButton');
        const cancelBtn = document.getElementById('cancelFontButton');
        
        const findBtn = document.getElementById('findBtn');
        const repBtn = document.getElementById('replaceBtn');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const closeFindBtn = document.getElementById('closeFindBtn');


        // Setup dragging on the font selector.
        body.ondrop = (ev) => {
            ev.preventDefault();
        }
        body.ondragover = (ev) => {
            ev.preventDefault();
            if($('#findReplaceWindow').css('visibility') === 'visible') {
                $('#findReplaceWindow').offset({
                    top: ev.pageY - $('#findReplaceWindow').outerHeight() / 2,
                    left: ev.pageX - $('#findReplaceWindow').outerWidth() / 2
                });
            } else if($('#fontDialog').css('visibility') === 'visible') {
                $('#fontDialog').offset({
                    top: ev.pageY - $('#fontDialog').outerHeight() / 2,
                    left: ev.pageX - $('#fontDialog').outerWidth() / 2
                });
            }
        }
        dialog.ondrop = (ev) => {
            ev.preventDefault();
        }
        // Set each font to itself... basically.
        for(var i = 0; i < options.length; i++) {
            options[i].style.fontFamily = options[i].innerHTML;
        }

       
        // Font
        saveBtn.onclick = () => {
            document.execCommand('fontName', false, selector.value);

            // Changing the font size is a little different than other stylings.
            const span = "<span style='font-size: " + sizeInput.value + "px'>" + document.getSelection().toString() + "</span>";
            document.execCommand('insertHTML', false, span);

            writingSettings.fontFamily = selector.value;
            writingSettings.fontSize = sizeInput.value;
            dialog.removeAttribute('open');
        };
        cancelBtn.onclick = () => {
            dialog.removeAttribute('open');
        };

        // Find/Replace
        findBtn.onclick = () => {
            // Clear last search.
            // Remove all the highlighting on the finds.
            found = [];
            foundIndex = 0;
            var finds = $('.find-highlight');
            finds.each((i) => {
                var sp = finds[i];
                var cnt = sp.innerHTML;
                sp.outerHTML = cnt;
            });

            // Find all the words. By the end of these two lines there will be a bunch of elements
            // that are highlighted blue and have a specific id.
            const search = $('#find-field').val();
            if(!helpers.containsLetter(search)) return;
            helpers.findInText([search]);

            // Get all the found elements.
            found = $('.find-highlight');

            // Scroll to the first location.
            var scroll = found[foundIndex].offsetTop - 20;
            found[foundIndex].style.backgroundColor = 'lightblue';
            noteField.scrollTop = scroll;
        }
        repBtn.onclick = () => {
            const rep = $('#replace-field').val();
            found[foundIndex].innerHTML = rep;
        }
        prevBtn.onclick = () => {
            // Go to the last found item.
            if(foundIndex - 1 < 0) return;
            foundIndex -= 1;
            
            // Scroll to that item.
            var scroll = found[foundIndex].offsetTop - 20;
            found[foundIndex+1].style.backgroundColor = 'rgba(0,0,0,0)';
            found[foundIndex].style.backgroundColor = 'lightblue';
            noteField.scrollTop = scroll;
        }
        nextBtn.onclick = () => {
            // Go to the next found item.
            if(foundIndex + 1 >= found.length) return;
            foundIndex += 1;
            
            // Scroll to that item.
            var scroll = found[foundIndex].offsetTop - 20;
            found[foundIndex-1].style.backgroundColor = 'rgba(0,0,0,0)';
            found[foundIndex].style.backgroundColor = 'lightblue';
            noteField.scrollTop = scroll;
        }
        closeFindBtn.onclick = () => {
            document.getElementById('findReplaceWindow').style.visibility = 'hidden';
            
            // Remove all the highlighting on the finds.
            var finds = $('.find-highlight');
            finds.each((i) => {
                var sp = finds[i];
                var cnt = sp.innerHTML;
                sp.outerHTML = cnt;
            })
        }
    }

    




    /************************
    *                       *
    *          INIT         *
    *                       *
    *************************/

    titleField.onkeyup = () => { global.currentTitle = titleField.value; }
    noteField.onkeydown = (e) => {
        if(e.key === 'Tab') {
            var s = '';
            for(var i = 0; i < appSettings.tabSize; i++) { s += '\u00a0'; }

            document.execCommand('insertHTML', false, s);
            e.preventDefault();
        }
    }
    noteField.onscroll = () => {
        global.currentScroll = noteField.scrollTop;
    }

    // Run some methods initially.
    noteField.focus();
    configureFontSelectorAndFindReplace();
    
    // Auto login.
    if(global.currentUser === null) helpers.autoLogin(fireAuth, fireRef, loadNotes);
    
    // Set the colors based on the app settings
    notesViewBtn.style.backgroundColor = appSettings.colorScheme;

    // Load all of the user's notebooks.
    if(global.currentUser !== null) loadNotes(global.currentUser.uid);

    // Load the note that the user was last on, if it exists.
    const note = helpers.getCurrentNote(notebooks);
    if(note !== undefined && note.id !== '') {
        titleField.value = note.title;
        noteField.innerHTML = note.content;
        global.currentTitle = note.title;
        global.currentContent = note.content;
        currentNoteID = note.id;
        noteField.scrollTop = global.currentScroll; // Go back to scroll location.
    }


    // Open the notes view.
    notesViewBtn.onclick = () => {
        notesView.style.display = 'block';
    }
    window.onclick = (e) => {
        if (e.target == notesView) {
            notesView.style.display = 'none';
        }
    }

    



    /************************
    *                       *
    *         EVENTS        *
    *                       *
    *************************/

    // Only run these event methods if they have not already been run (i.e. on startup).
    if(eventsAgain === true) {
        BrowserWindow.getFocusedWindow().on('save', (event) => {
            const content = noteField.innerHTML;
            const title = titleField.value;

            if(title !== '') {
                if(global.currentUser === null) {
                    alert('You must be logged in to save notes.');
                    return;
                } else {
                    saveNote(title, content);
                }
            } else {
                alert('Try adding some text to this note before saving it.');
                return;
            }
        });
        BrowserWindow.getFocusedWindow().on('print', (event) => { window.print(); });
        BrowserWindow.getFocusedWindow().on('undo', (event) => { document.execCommand('undo', false); });
        BrowserWindow.getFocusedWindow().on('redo', (event) => { document.execCommand('redo', false); });
        BrowserWindow.getFocusedWindow().on('cut', (event) => { document.execCommand('cut', false); });
        BrowserWindow.getFocusedWindow().on('copy', (event) => { document.execCommand('copy', false); });
        BrowserWindow.getFocusedWindow().on('paste', (event) => { document.execCommand('paste', false); });
        BrowserWindow.getFocusedWindow().on('select-all', (event) => { document.execCommand('selectAll', false); });
        BrowserWindow.getFocusedWindow().on('subscript', (event) => { document.execCommand('subscript', true); });
        BrowserWindow.getFocusedWindow().on('superscript', (event) => { document.execCommand('superscript', true); });
        BrowserWindow.getFocusedWindow().on('bulleted-list', (event) => {
            writingSettings.bulletedList = !writingSettings.bulletedList;
            writingSettings.numberedList = false;
            document.execCommand('insertUnorderedList', false);
        });
        BrowserWindow.getFocusedWindow().on('numbered-list', (event) => {
            writingSettings.numberedList = !writingSettings.numberedList;
            writingSettings.bulletedList = false;
            document.execCommand('insertOrderedList', false);
        });
        BrowserWindow.getFocusedWindow().on('code-segment', (event) => {
            // Create the code segment.
            const bgColor = 'background-color: rgb(229, 229, 229);';
            const codeSegment = '<div class="codeSegmentArea" contentEditable="true" tabindex="1" style="' + bgColor + '">Start typing code here</div>';

            // Insert it into the note area.
            document.execCommand('insertHTML', true, '<br>' + codeSegment + '<br>');
        });
        BrowserWindow.getFocusedWindow().on('bold', (event) => { 
            writingSettings.bold = !writingSettings.bold;
            document.execCommand('bold', true, writingSettings.bold);
        });
        BrowserWindow.getFocusedWindow().on('underline', (event) => {  
            writingSettings.underline = !writingSettings.underline;
            document.execCommand('underline', true, writingSettings.underline);
        });
        BrowserWindow.getFocusedWindow().on('italic', (event) => { 
            writingSettings.italic = !writingSettings.italic;
            document.execCommand('italic', true, writingSettings.italic);
        });
        BrowserWindow.getFocusedWindow().on('font', (event) => {
            document.getElementById('fontDialog').setAttribute('open', true);
            document.getElementById('findReplaceWindow').style.visibility = 'hidden';
        });
        BrowserWindow.getFocusedWindow().on('align-left', (event) => {
            writingSettings.alignment = 'justifyLeft';
            document.execCommand(writingSettings.alignment, false);
        });
        BrowserWindow.getFocusedWindow().on('align-center', (event) => {
            writingSettings.alignment = 'justifyCenter';
            document.execCommand(writingSettings.alignment, false);
        });
        BrowserWindow.getFocusedWindow().on('align-right', (event) => {
            writingSettings.alignment = 'justifyRight';
            document.execCommand(writingSettings.alignment, false);
        });
        BrowserWindow.getFocusedWindow().on('highlight', (event) => {
            writingSettings.highlighterOn = !writingSettings.highlighterOn;
            if(writingSettings.highlighterOn === true) {
                document.execCommand('backColor', false, '#FFE000');
            } else {
                document.execCommand('backColor', false, 'rgba(0,0,0,0)');
            }
        });
        BrowserWindow.getFocusedWindow().on('share-email', (event) => {
            // Show email window.
            const btnClick = '';
            var alrt = '<div style="text-align:center">';
            alrt += '<h2 style="font-size:18px;margin-top:-15px">Enter your settings for this email:</h2>';
            alrt += '<input id="email-from-field" type="text" placeholder="sender@mail.com"/>';
            alrt += '<br>';
            alrt += '<input id="email-password-field" type="password" placeholder="sender password"/>';
            alrt += '<br>';
            alrt += '<input id="email-to-field" type="text" placeholder="receiver@mail.com"/>';
            alrt += '<br>';
            alrt += '</div>';
            alertify.okBtn('Send!').confirm(alrt, () => {
                t = nodemailer.createTransport({
                    service: 'Gmail',
                    secure: 'false',
                    auth: {
                        user: document.getElementById('email-from-field').value,
                        pass: document.getElementById('email-password-field').value,
                    },
                    tls: {
                        rejectUnauthorized: false,
                    }
                });

                t.verify(function(error, success) {
                    if (error) {
                        alertify.okBtn('Ok').alert('You are not able to send an email from this app due to your current email security rules.'
                                        + ' Check your email for a message on how you can change your settings to allow for sending'
                                        + ' email from Noteworthy');
                        return;
                    } else {
                        t.sendMail({
                            from: document.getElementById('email-from-field').value,
                            to: document.getElementById('email-to-field').value,
                            subject: getCurrentNote().title,
                            text: noteField.innerText,
                            html: noteField.innerHTML
                        }, (err) => {
                            if(err) { alertify.alert('' + err); return; }
                            alertify.alert('Email Sent!');
                            return;
                        });
                    }
                });
                
            }, () => {
                // Nothing.
            });
            document.getElementById('email-from-field').placeholder = "sender@mail.com";
            return;
        })
        BrowserWindow.getFocusedWindow().on('find-replace', (event) => {
            document.getElementById('fontDialog').removeAttribute('open');
            document.getElementById('findReplaceWindow').style.visibility = 'visible';
        })
        BrowserWindow.getFocusedWindow().on('word-count', (event) => {
            var text = getText(document.getElementById('noteArea'));
            wordCount = text.trim().replace(/\s+/g, ' ').split(' ').length;
            alertify.okBtn('Done').alert(`<h3 style='font-weight:100;font-size:22px'> <b>Word Count:</b> ${wordCount}</h3>`);
        });
        BrowserWindow.getFocusedWindow().on('export-pdf', (event) => {
            doc.fromHTML(noteField.innerHTML, 15, 15, {
                'width': 170
            });
            doc.save('Untitled.pdf');
        });
        BrowserWindow.getFocusedWindow().on('export-txt', (event) => {
            const { dialog } = require('electron').remote;
            dialog.showSaveDialog(null, {
                title: 'Untitled.txt',
                filters: [{name: 'txt', extensions: ['txt']}]
            }, (filename) => {
                fs.writeFileSync(filename, noteField.innerHTML, 'utf8');

                alertify.success(`Exported to ${filename.substring(filename.lastIndexOf('/') + 1)}`);
            })
        });
        BrowserWindow.getFocusedWindow().on('export-md', (event) => {
            const { dialog } = require('electron').remote;
            dialog.showSaveDialog(null, {
                title: 'Untitled.md',
                filters: [{name: 'md', extensions: ['md']}]
            }, (filename) => {
                const markdown = turndown.turndown(noteField.innerHTML);
                fs.writeFileSync(filename, markdown, 'utf8');

                alertify.success(`Exported to ${filename.substring(filename.lastIndexOf('/') + 1)}`);
            })
        });
        BrowserWindow.getFocusedWindow().on('export-html', (event) => {
            const { dialog } = require('electron').remote;
            dialog.showSaveDialog(null, {
                title: 'Untitled.html',
                filters: [{name: 'html', extensions: ['html']}]
            }, (filename) => {
                fs.writeFileSync(filename, noteField.innerHTML, 'utf8');

                alertify.success(`Exported to ${filename.substring(filename.lastIndexOf('/') + 1)}`);
            })
        });        
        //
        // CHANGE THE COLORING TOO
        //
        //
        // ALSO, IF YOU TRY AND SAVE WITHOUT LOGGING IN, LOOK AT THE USER'S SETTINGS
        // TO DECIDE WHETHER TO DISPLAY A WARNING OR TO JUST SAVE IT LOCALLY.
        // SO YOU NEED ANOTHER USER SETTING.
        //
    }

    // These events don't follow the eventsAgain structure...
    BrowserWindow.getFocusedWindow().on('open-note-view', (event) => {
        notesView.style.display = 'block';
    });
    BrowserWindow.getFocusedWindow().on('note-options', (event) => {
        if(sliderOpen) {
            optionsButton.style.bottom = '30px';
            optionsSlider.style.bottom = '-80px';
            sliderOpen = false;
        } else {
            optionsButton.style.bottom = '110px';
            optionsSlider.style.bottom = '0px';
            sliderOpen = true;
            optionsSlider.focus();
        }
    });
    BrowserWindow.getFocusedWindow().on('quit-app', (event) => {
        // Check if you for got to save.
        if(forgotToSave(titleField, noteField)) {
            helpers.showPromptDialog('You are about to quit the app, but have unsaved changes. Do you still want to quit?', 
            "Yes, Quit", "Cancel", () => {
                app.quit();
            });
        } else {
            app.quit();
        }
    });
    BrowserWindow.getFocusedWindow().on('retreive-backups', (event) => {
        helpers.showPromptDialog('Using the "Retreive from Backups" feature allows you to retreive any note that may be lost or deleted by using a Noteworthy backup file. Select the backup files below and Noteworthy will try to recreate the notes for you.', 'Select Backup Files', 'Cancel', () => {
            const { dialog } = require('electron').remote;
            dialog.showOpenDialog(null, {
                properties: ['openFile', 'multiSelections'],
            }, (paths) => {
                if(paths !== undefined) {
    
                    // 1.) Loop through each selected file and parse its data as a JSON tree.
                    // 2.) For each JSON, check if a note in the database already exists with that ID.
                    // 2a.) If the note exists, set the values of the note in the database to the data from the parsed JSON.
                    // 2b.) If the note DOES NOT exist, take the data from the backup file and create a new note in the database.
                    // 3.) Reload the notes for the currently logged in user so that the changes are reflected locally.
                    for(var i = 0; i < paths.length; i++) {
                        const currentPath = paths[i];
                        const data = JSON.parse(fs.readFileSync(currentPath, 'utf8'));
    
                        helpers.databaseContains(data.id, fireRef, () => {
                            helpers.updateNote(data, fireRef);
                        }, () => {
                            const n = helpers.createNewNote(data, currentPath, fireRef);
                        });
                    }
                }
            });
        });
    });
};