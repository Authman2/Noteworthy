const fs = require('fs');
const $ = require('jquery');
const spectrum = require('spectrum-colorpicker');
const global = require('electron').remote.getGlobal('sharedObject');
const alertify = require('alertify.js');
const helpers = require('./helpers.js');
const remote = require('electron').remote;
const app = remote.app;
const {Menu, MenuItem} = remote;


/** Everything is basically one big function that gets called by the renderer. */
module.exports = (body, titleBar, appSettings, fireAuth, fireRef, ipc, eventsAgain) => {

    // 1.) Start by populating the body with the HTML for the home page.
    // To do this, you will load that file with fs-extra, then place the
    // contents into the innerHTML of the body. Make sure you also clear out
    // whatever is currently there from the last page.
    body.innerHTML = '';
    const loadedPage = fs.readFileSync(__dirname + '/../html/home.html', 'utf8');
    const slider = fs.readFileSync(__dirname + '/../html/note-options.html', 'utf8');
    const sb = fs.readFileSync(__dirname + '/../html/notebooks-slider.html', 'utf8');
    body.innerHTML = titleBar + slider + sb + loadedPage;
    
    /************************
    *                       *
    *       VARIABLES       *
    *                       *
    *************************/

    var sidebarOpen = false;
    var sliderOpen = false;
    
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

    const optionsSlider = document.getElementById('optionsSlider');
    const sidebar = document.getElementById('sidebar');

    const optionsButton = document.getElementById('optionsButton');
    const sidebarButton = document.getElementById('sidebarButton');

    const optionsTitleLabels = document.getElementsByClassName('optionsItemTitle');



    /************************
    *                       *
    *       FUNCTIONS       *
    *                       *
    *************************/    

    /** Loads all of the notes for a given user. Loads them asyncronously. */
    const loadNotes = (uid) => {
        fireRef.child('notes').orderByChild('creator').equalTo(uid).on('child_added', (snap) => {
            var a = snap.val();
            notebooks.push(a);
            notebooks = notebooks.sort((a,b) => { return a.timestamp - b.timestamp });

            configureNotbookSlider(sidebar, titleField, noteField);
        });
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

    /** Sets up the data in the notebook slider. */
    const configureNotbookSlider = (list, titleField, noteField) => {
        // Clear the list.
        list.innerHTML = "<h4 id='sidebarTitle' style='color:" + appSettings.sidebarTextColor + "'>Notes</h4>";

        for(var i = 0; i < notebooks.length; i++) {
            const current = notebooks[i];

            // Create the list item.
            const item = document.createElement('div');
            item.className = 'sidebarItem';

            const title = document.createElement('p');
            title.className = 'sidebarItemTitle';
            title.innerHTML = current.title;
            title.style.color = appSettings.sidebarTextColor;

            item.appendChild(title);


            // Define click behavior.
            const closeSidebar = () => {
                sidebarButton.style.right = '15px';
                sidebar.style.right = '-200px';
                sidebarOpen = false;
                optionsButton.style.opacity = 1;
            }
            const displayText = () => {
                noteField.focus();
                noteField.innerHTML = current.content;
                currentNoteID = current.id;
                global.currentID = current.id;
            }

            // Different behaviors for New and Existing notes.
            if(current.title === 'New') {
                item.onclick = () => {
                    if(forgotToSave(titleField, noteField)) {
                        helpers.showPromptDialog('Looks like you forgot to save. Would you like to continue anyway?', 
                        "Continue", "Cancel", () => {
                            titleField.value = '';
                            noteField.innerHTML = '';
                            global.currentTitle = '';
                            global.currentContent = '';
                            currentNoteID = null;
                            global.currentID = '';
                            closeSidebar();
                        });
                    } else {
                        titleField.value = '';
                        noteField.innerHTML = '';
                        global.currentTitle = '';
                        global.currentContent = '';
                        currentNoteID = null;
                        global.currentID = '';
                        closeSidebar();
                    }
                }
            } else {
                item.onclick = () => {
                    if(forgotToSave(titleField, noteField)) {
                        helpers.showPromptDialog('Looks like you forgot to save. Would you like to continue anyway?', 
                        "Continue", "Cancel", () => {
                            titleField.value = current.title;
                            noteField.innerHTML = current.content;
                            global.currentTitle = current.title;
                            global.currentContent = current.content;
                            currentNoteID = current.id;
                            global.currentID = current.id;
                            displayText();
                        });
                    } else {
                        titleField.value = current.title;
                        noteField.innerHTML = current.content;
                        global.currentTitle = current.title;
                        global.currentContent = current.content;
                        currentNoteID = current.id;
                        global.currentID = current.id;
                        displayText();
                    }
                }
            }

            // Define the mouse behavior.
            const noteCxtMenu = new Menu();
            noteCxtMenu.append(new MenuItem({
                label: 'Delete',
                click: () => {
                    helpers.showPromptDialog('Are you sure you want to delete this note?', 'Yes', 'No', () => {
                        helpers.deleteNote(current.id, fireRef, notebooks, loadNotes);
                        
                        // Reload the notebooks.
                        notebooks = [{
                            id: '',
                            title: 'New',
                            content: '',
                            creator: '',
                            timestamp: 0
                        }];
                        loadNotes(global.currentUser.uid);
                    });
                }
            }));
            item.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                noteCxtMenu.popup(remote.getCurrentWindow());
            }, false);


            // Add to the sidebar.
            list.appendChild(item);
        }
    };

    /** Handles saving a note to the database under a certain user. */
    const saveNote = (title, content) => {
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

    // Handles button presses in the sidebar.
    const handleOptionsSliderButtons = () => {
        // Color
        $('#sidebar_Color').spectrum({
            color: writingSettings.color,
            showInput: true,
            change: function(color) {
                writingSettings.color = color.toRgbString();
                document.execCommand('foreColor', false, writingSettings.color);
            }
        });
        
        // Font
        $('#sidebar_Font').click(() => {
            const dialog = document.getElementById('fontDialog');
            if(dialog.hasAttribute('open')) { dialog.removeAttribute('open'); }
            else { dialog.setAttribute('open', true); dialog.focus(); }
        });

        // Alignment
        $('#sidebar_Alignment').click( () => {
            if(writingSettings.alignment === 'justifyLeft') {
                writingSettings.alignment = 'justifyCenter';
            } else if(writingSettings.alignment === 'justifyCenter') {
                writingSettings.alignment = 'justifyRight';
            } else {
                writingSettings.alignment = 'justifyLeft';
            }
            document.execCommand(writingSettings.alignment, false);
        });

        // Bold
        $('#sidebar_Bold').click( () => {
            writingSettings.bold = !writingSettings.bold;
            document.execCommand('bold', false, writingSettings.bold);
        });

        // Underline
        $('#sidebar_Underline').click( () => {
            writingSettings.underline = !writingSettings.underline;
            document.execCommand('underline', false, writingSettings.underline);
        });

        // Italic
        $('#sidebar_Italic').click( () => {
            writingSettings.italic = !writingSettings.italic;
            document.execCommand('italic', false, writingSettings.italic);
        });

        // Highlighter
        $('#sidebar_Highlighter').click( () => {
            writingSettings.highlighterOn = !writingSettings.highlighterOn;
            document.execCommand('backColor', false, '#FFE000');
        });

        // Lists
        $('#sidebar_BulletedList').click( () => {
            writingSettings.bulletedList = !writingSettings.bulletedList;
            writingSettings.numberedList = false;

            document.execCommand('insertUnorderedList', false);
        });
        $('#sidebar_NumberedList').click( () => {
            writingSettings.numberedList = !writingSettings.numberedList;
            writingSettings.bulletedList = false;

            document.execCommand('insertOrderedList', false);
        });
    }

    // Font selection
    const configureFontSelector = () => {
        const dialog = document.getElementById('fontDialog');
        
        const selector = document.getElementById('fontSelector');
        const options = document.getElementsByTagName('option');
        const sizeInput = document.getElementById('fontSizeSelector');

        const saveBtn = document.getElementById('saveFontButton');
        const cancelBtn = document.getElementById('cancelFontButton');


        // Setup dragging on the font selector.
        body.ondrop = (ev) => {
            ev.preventDefault();
        }
        body.ondragover = (ev) => {
            ev.preventDefault();
            $('#fontDialog').offset({
                top: ev.pageY - $('#fontDialog').outerHeight() / 2,
                left: ev.pageX - $('#fontDialog').outerWidth() / 2
            });
        }
        dialog.ondrop = (ev) => {
            ev.preventDefault();
        }


        // Set each font to itself... basically.
        for(var i = 0; i < options.length; i++) {
            options[i].style.fontFamily = options[i].innerHTML;
        }

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

    // Run some methods initially.
    configureFontSelector();
    handleOptionsSliderButtons();
    
    // Auto login.
    if(global.currentUser === null) helpers.autoLogin(fireAuth, fireRef, loadNotes);
    
    // Set the colors based on the app settings
    optionsButton.style.backgroundColor = appSettings.colorScheme;
    optionsSlider.style.backgroundColor = appSettings.colorScheme;
    sidebar.style.backgroundColor = appSettings.colorScheme;
    
    // Cannot set sidebar titles colors here.
    for(var i = 0; i < optionsTitleLabels.length; i++) {
        optionsTitleLabels[i].style.color = appSettings.sidebarTextColor;
    }

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
    }

    // Toggle the notebook slider.
    optionsButton.onclick = function() {
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
    }
    // Toggle the sidebar.
    sidebarButton.onclick = function() {
        if(sidebarOpen) {
            sidebarButton.style.right = '15px';
            sidebar.style.right = '-200px';
            sidebarOpen = false;
            optionsButton.style.opacity = 1;
        } else {
            sidebarButton.style.right = '215px';
            sidebar.style.right = '0px';
            sidebarOpen = true;
            optionsButton.style.opacity = 0.3;
        }
    }



    /************************
    *                       *
    *         EVENTS        *
    *                       *
    *************************/

    // Only run these event methods if they have not already been run (i.e. on startup).
    if(eventsAgain === true) {
        ipc.on('save', (event) => {
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
        ipc.on('print', (event) => { window.print(); });
        ipc.on('undo', (event) => { document.execCommand('undo', false); });
        ipc.on('redo', (event) => { document.execCommand('redo', false); });
        ipc.on('cut', (event) => { document.execCommand('cut', false); });
        ipc.on('copy', (event) => { document.execCommand('copy', false); });
        ipc.on('paste', (event) => { document.execCommand('paste', false); });
        ipc.on('select-all', (event) => { document.execCommand('selectAll', false); });
        ipc.on('subscript', (event) => { document.execCommand('subscript', true); });
        ipc.on('superscript', (event) => { document.execCommand('superscript', true); });
        ipc.on('bulleted-list', (event) => {
            writingSettings.bulletedList = !writingSettings.bulletedList;
            writingSettings.numberedList = false;
            document.execCommand('insertUnorderedList', false);
        });
        ipc.on('numbered-list', (event) => {
            writingSettings.numberedList = !writingSettings.numberedList;
            writingSettings.bulletedList = false;
            document.execCommand('insertOrderedList', false);
        });
        ipc.on('code-segment', (event) => {
            // Create the code segment.
            const bgColor = 'background-color: rgb(229, 229, 229);';
            const codeSegment = '<div class="codeSegmentArea" contentEditable="true" tabindex="1" style="' + bgColor + '">Start typing code here</div>';

            // Insert it into the note area.
            document.execCommand('insertHTML', true, '<br>' + codeSegment + '<br>');
        });
        ipc.on('bold', (event) => { 
            writingSettings.bold = !writingSettings.bold;
            document.execCommand('bold', true, writingSettings.bold);
        });
        ipc.on('underline', (event) => {  
            writingSettings.underline = !writingSettings.underline;
            document.execCommand('underline', true, writingSettings.underline);
        });
        ipc.on('italic', (event) => { 
            writingSettings.italic = !writingSettings.italic;
            document.execCommand('italic', true, writingSettings.italic);
        });
        ipc.on('font', (event) => {
            document.getElementById('fontDialog').setAttribute('open', true);
        });
        ipc.on('align-left', (event) => {
            writingSettings.alignment = 'justifyLeft';
            document.execCommand(writingSettings.alignment, false);
        });
        ipc.on('align-center', (event) => {
            writingSettings.alignment = 'justifyCenter';
            document.execCommand(writingSettings.alignment, false);
        });
        ipc.on('align-right', (event) => {
            writingSettings.alignment = 'justifyRight';
            document.execCommand(writingSettings.alignment, false);
        });
        ipc.on('highlight', (event) => {
            writingSettings.highlighterOn = !writingSettings.highlighterOn;
            if(writingSettings.highlighterOn === true) {
                document.execCommand('backColor', false, '#FFE000');
            } else {
                document.execCommand('backColor', false, 'rgba(0,0,0,0)');
            }
        });
        ipc.on('share-email', (event) => {
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
    }

    // These events don't follow the eventsAgain structure...
    ipc.on('open-sidebar', (event) => {
        if(sidebarOpen) {
            sidebarButton.style.right = '15px';
            sidebar.style.right = '-200px';
            sidebarOpen = false;
            optionsButton.style.opacity = 1;
        } else {
            sidebarButton.style.right = '215px';
            sidebar.style.right = '0px';
            sidebarOpen = true;
            optionsButton.style.opacity = 0.3;
        }
    });
    ipc.on('note-options', (event) => {
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
    ipc.on('quit-app', (event) => {
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
};