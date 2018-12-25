/************************
*                       *
*        REQUIRES       *
*                       *
*************************/

const fs = require('fs');
const $ = require('jquery');
const firebase = require('firebase');
const Globals = require('../../Globals.js');
const remote = require('electron').remote;
const BrowserWindow = remote.BrowserWindow;
const { dialog } = require('electron').remote;
const alertify = require('alertify.js');
const storage = require('electron-json-storage');
const Moment = require('moment');
const jsdiff = require('diff');

const worker = new Worker(`${__dirname}/AsyncCode.js`);
worker.addEventListener('message', (event) => {
    if(currentNote) { localSave(); }
});


/************************
*                       *
*       VARIABLES       *
*                       *
*************************/

// The storage object.
const store = storage.getDefaultDataPath();

// The notes that have been loaded from the database.
var loadedData = {};
var notebooks;
var notes;
var currentNotebook;
var currentNote;

// The root body and the page manager.
var body;
var pager;

// The different contexts that are available.
var vcm, secm, icm, stcm;
const Contexts = {
    View: {},
    Selection: {},
    Insert: {},
    Settings: {}
};
var currentContext = Contexts.View;



/************************
*                       *
*          INIT         *
*                       *
*************************/

/** Start the home page actions. */
const init = (root, pageManager) => {
    body = root;
    pager = pageManager;

    Globals.loadHTMLInto('Work.html', body);

    const titleField = document.getElementById('title-field');
    const noteField = document.getElementById('note-field');
    const workPage = document.getElementById('work-page');
    
    document.oninput = (e) => {
        if(e.target.id === 'note-field') {
            setTimeout(() => {
                worker.postMessage(0);
            }, 1500);
        }
    }
    document.onmousedown = (e) => {
        noteField.focus();
        if(e.clientY >= 250) { $('.notes-view').remove(); }
    }
    
    setupRefs();
    updateContextMenu();

    loadNotes(() => {
        const previousNoteButton = document.getElementById('vcm-previous-note-btn');
        const nextNoteButton = document.getElementById('vcm-next-note-btn');
        const currentNotes = notes.filter((nt) => nt.notebook === currentNotebook.id);
        updateNotesQuickMove(previousNoteButton, nextNoteButton, currentNotes);
    });
}

/** Gets the references to all of the variables. */
const setupRefs = () => {
    vcm = fs.readFileSync(`${__dirname}/../html/contexts/ViewContextMenu.html`, 'utf8');
    secm = fs.readFileSync(`${__dirname}/../html/contexts/SelectionContextMenu.html`, 'utf8');
    icm = fs.readFileSync(`${__dirname}/../html/contexts/InsertContextMenu.html`, 'utf8');
    stcm = fs.readFileSync(`${__dirname}/../html/contexts/SettingsContextMenu.html`, 'utf8');
}

/** Updates the view depending on the type of context menu. */
const updateContextMenu = (updateQuickMove = false) => {
    $('.context-menu-holder').remove();
    
    switch(currentContext) {
        case Contexts.View:
            body.innerHTML += vcm;
            handleViewContextMenuActions();
            showActionAlert('Switched to <b>View</b> Context', 'gray');
            break;
        case Contexts.Selection:
            body.innerHTML += secm;
            handleViewContextMenuActions();
            handleSelectionContextMenuActions();
            showActionAlert('Switched to <b>Selection</b> Context', 'gray');
            break;
        case Contexts.Insert:
            body.innerHTML += icm;
            handleViewContextMenuActions();
            handleInsertContextMenuActions();
            showActionAlert('Switched to <b>Insert</b> Context', 'gray');
            break;
        case Contexts.Settings:
            body.innerHTML += stcm;
            handleViewContextMenuActions();
            handleSettingsContextMenuActions();
            showActionAlert('Switched to <b>Settings</b> Context', 'gray');
            break;
    }

    if(currentNote) {
        const titleField = document.getElementById('title-field');
        titleField.value = `${currentNote.title}`;
    }
    
    if(updateQuickMove === true) {
        const previousNoteButton = document.getElementById('vcm-previous-note-btn');
        const nextNoteButton = document.getElementById('vcm-next-note-btn');
        const currentNotes = notes.filter((nt) => nt.notebook === currentNotebook.id);
        updateNotesQuickMove(previousNoteButton, nextNoteButton, currentNotes);
    }
}

/** Updates the previous and next buttons for notes. */
const updateNotesQuickMove = (previousNoteButton, nextNoteButton, currentNotes) => {
    const index = currentNote ? currentNotes.indexOf(currentNote) : 0;
    
    if(currentNotes.length <= 1) {
        previousNoteButton.disabled = true;
        previousNoteButton.style.opacity = 0.3;
        previousNoteButton.style.cursor = 'pointer';
        nextNoteButton.disabled = true;
        nextNoteButton.style.opacity = 0.3;
        nextNoteButton.style.cursor = 'default';
    } else {

        if(index <= 0) {
            previousNoteButton.disabled = true;
            previousNoteButton.style.opacity = 0.3;
            previousNoteButton.style.cursor = 'default';
        } else {
            previousNoteButton.disabled = false;
            previousNoteButton.style.opacity = 1;
            previousNoteButton.style.cursor = 'pointer';
        }
        if(index >= currentNotes.length - 1) {
            nextNoteButton.disabled = true;
            nextNoteButton.style.opacity = 0.3;
            nextNoteButton.style.cursor = 'default';
        } else {
            nextNoteButton.disabled = false;
            nextNoteButton.style.opacity = 1;
            nextNoteButton.style.cursor = 'pointer';
        }
    }
}




/************************
*                       *
*       FUNCTIONS       *
*                       *
*************************/

const switchContext = () => {
    $('.notes-view').remove();
    
    switch(currentContext) {
        case Contexts.View:
            currentContext = Contexts.Selection;
            break;
        case Contexts.Selection:
            currentContext = Contexts.Insert;
            break;
        case Contexts.Insert:
            currentContext = Contexts.Settings;
            break;
        case Contexts.Settings:
            currentContext = Contexts.View;
            break;
    }
}

/** Shows the action alert with some text. */
const showActionAlert = (text, color) => {
    $('.action-alert').remove();

    const alert = document.createElement('p');
    alert.className = 'action-alert';
    alert.innerHTML = text;
    alert.style.backgroundColor = color;
    body.appendChild(alert);

    setTimeout(() => {
        $(alert).animate({
            opacity: 0,
            bottom: '-10px'
        }, '0.3s', () => {
            const children = [].slice.call(document.body.children);
            if(children.includes(alert)) body.removeChild(alert);
        })
    }, 2500);
}

/** Handles actions on the View Context Menu. */
const handleViewContextMenuActions = () => {
    const titleField = document.getElementById('title-field');
    const noteField = document.getElementById('note-field');
    const previousNoteButton = document.getElementById('vcm-previous-note-btn');
    const nextNoteButton = document.getElementById('vcm-next-note-btn');
    const newButton = document.getElementById('vcm-new-btn');
    const shareButton = document.getElementById('vcm-share-btn');
    const notebooksButton = document.getElementById('vcm-notebooks-btn');
    const notesButton = document.getElementById('vcm-notes-btn');

    newButton.onclick = () => {
        _newButton();
    }
    shareButton.onclick = () => {
        _shareButton();
    }
    notebooksButton.onclick = () => {
        _notebooksButton();
    }
    notesButton.onclick = () => {
        _notesButton();
    }
    previousNoteButton.onclick = () => {
        const currentNotes = notes.filter((nt) => nt.notebook === currentNotebook.id);
        const index = currentNote ? currentNotes.indexOf(currentNote) : 1;
        
        if(index - 1 >= 0) {
            currentNote = currentNotes[index - 1];
            titleField.value = currentNote.title;
            noteField.innerHTML = currentNote.content;
            showActionAlert(`Opened <b>${currentNote.title}</b>`, '#60A4EB');
        }

        // Update the previous and next buttons.
        updateNotesQuickMove(previousNoteButton, nextNoteButton, currentNotes);
    }
    nextNoteButton.onclick = () => {
        const currentNotes = notes.filter((nt) => nt.notebook === currentNotebook.id);
        const index = currentNote ? currentNotes.indexOf(currentNote) : 1;
        
        if(index + 1 < currentNotes.length) {
            currentNote = currentNotes[index + 1];
            titleField.value = currentNote.title;
            noteField.innerHTML = currentNote.content;
            showActionAlert(`Opened <b>${currentNote.title}</b>`, '#60A4EB');
        }

        // Update the previous and next buttons.
        updateNotesQuickMove(previousNoteButton, nextNoteButton, currentNotes);
    }
}

/** Handles actions on the View Context Menu. */
const handleSelectionContextMenuActions = () => {
    const boldBtn = document.getElementById('secm-bold-btn');
    const italicBtn = document.getElementById('secm-italic-btn');
    const underlineBtn = document.getElementById('secm-underline-btn');
    const highlightBtn = document.getElementById('secm-highlight-btn');
    const subscriptBtn = document.getElementById('secm-subscript-btn');
    const superscriptBtn = document.getElementById('secm-superscript-btn');

    boldBtn.onclick = () => {
        _boldButton();
    }
    italicBtn.onclick = () => {
        _italicButton();
    }
    underlineBtn.onclick = () => {
        _underlineButton();
    }
    highlightBtn.onclick = () => {
        _highlightButton();
    }
    subscriptBtn.onclick = () => {
        _subscriptButton();
    }
    superscriptBtn.onclick = () => {
        _superscriptButton();
    }
}

/** Handles actions on the View Context Menu. */
const handleInsertContextMenuActions = () => {
    const codeBtn = document.getElementById('icm-code-btn');
    const unsortedBtn = document.getElementById('icm-unsorted-btn');
    const sortedBtn = document.getElementById('icm-sorted-btn');
    const checkboxBtn = document.getElementById('icm-checkbox-btn');
    const imageBtn = document.getElementById('icm-image-btn');

    codeBtn.onclick = () => {
        _codeButton();
    }
    unsortedBtn.onclick = () => {
        _bulletedListButton();
    }
    sortedBtn.onclick = () => {
        _numberedListButton();
    }
    checkboxBtn.onclick = () => {
        _checkboxButton();
    }
    imageBtn.onclick = () => {
        _imageButton();
    }
}

/** Handles actions on the View Context Menu. */
const handleSettingsContextMenuActions = () => {
    const accountBtn = document.getElementById('stcm-account-btn');
    const saveOnlineBtn = document.getElementById('stcm-save-online-btn');
    const loadOnlineBtn = document.getElementById('stcm-load-online-btn');

    accountBtn.onclick = () => {
        _accountButton();
    }
    saveOnlineBtn.onclick = () => {
        onlineSave(true, () => {});
    }
    loadOnlineBtn.onclick = () => {
        onlineLoad();
    }
}

/** Loads the notes from the local computer's file system. */
const loadNotes = (then) => {
    storage.get(`NoteworthySaveData.json`, (err, data) => {
        if(err) {
            loadedData = {}
            return;
        }

        const nbs = Object.values(data).filter((val, _, __) => val.pages);
        const nts = Object.values(data).filter((val, _, __) => val.notebook);
        loadedData = data;
        notebooks = nbs;
        notes = nts;

        if(notebooks.length > 0) currentNotebook = notebooks[0];
        if(then) then();
    });
}

/** Opens a note and fills in the title and note fields. */
const openNote = (note) => {
    const titleField = document.getElementById('title-field');
    const noteField = document.getElementById('note-field');

    titleField.value = note.title;
    noteField.innerHTML = note.content;
    $('.notes-view').remove();

    showActionAlert(`Opened <b>${note.title}</b>`, '#60A4EB');

    // Update the previous and next buttons.
    const previousNoteButton = document.getElementById('vcm-previous-note-btn');
    const nextNoteButton = document.getElementById('vcm-next-note-btn');
    const currentNotes = notes.filter((nt) => nt.notebook === currentNotebook.id);
    updateNotesQuickMove(previousNoteButton, nextNoteButton, currentNotes);
}

/** The local save. */
const localSave = () => {
    if(!currentNote) return;

    const titleField = document.getElementById('title-field');
    const noteField = document.getElementById('note-field');

    if(currentNote.id in loadedData) {
        loadedData[currentNote.id].title = titleField.value;
        loadedData[currentNote.id].content = noteField.innerHTML;
    } else {
        loadedData[currentNote.id] = {
            id: currentNote.id,
            title: titleField.value,
            timestamp: currentNote.timestamp,
            notebook: currentNotebook.id,
            content: noteField.innerHTML,
            creator: firebase.auth().currentUser == null ? '' : firebase.auth().currentUser.uid
        }
    }
    notebooks = Object.values(loadedData).filter((val) => val.pages);
    notes = Object.values(loadedData).filter((val) => val.notebook);
    
    storage.set(`NoteworthySaveData`, loadedData, (err) => {
        if(err) {
            showActionAlert('There was a problem saving the data.', '#ea4d4d');
            return;
        }
    });
}

/** The online save. */
const onlineSave = (withAlert = false, then) => {
    if(!firebase.auth().currentUser) return;
    if(withAlert === true) showActionAlert('Saving...', 'gray');

    storage.set(`NoteworthySaveData`, loadedData, (err) => {
        if(err) {
            showActionAlert('There was a problem saving the data.', '#ea4d4d');
            return;
        }
        
        // Save the local database to firebase by updating all the objects with ids.
        const uid = firebase.auth().currentUser.uid;
        const json = loadedData;
        const outer = `{"${uid}": ${JSON.stringify(json)}}`;
        firebase.database().ref().set(JSON.parse(outer));

        if(withAlert === true) showActionAlert('Saved!', '#73BE4D');
        then();
    });
}

/** Loads the data from online. */
const onlineLoad = () => {
    showActionAlert('Loading...', 'gray');

    // Sync to firebase so that there is a local copy.
    const uid = firebase.auth().currentUser.uid;
    firebase.database().ref().orderByKey().equalTo(uid).once('value', (snap) => {
        const allNotebooksAndNotes = snap.val();
        if(allNotebooksAndNotes == null) return;

        // 1.) Get everything from the remote database and put it in the local database.
        const all = Object.values(allNotebooksAndNotes[uid]);
        
        loadedData = {};
        for(var id in all) {
            const item = all[id];
            loadedData[item.id] = item;
        }
        notebooks = Object.values(loadedData).filter((val) => val.pages);
        notes = Object.values(loadedData).filter((val) => val.notebook);

        showActionAlert('Loaded online copy of notes!', '#73BE4D');
    });
}



/************************
*                       *
*        HELPERS        *
*                       *
*************************/

const _newButton = () => {
    Globals.showNewAlert(body, (type, title) => {
        if(type === 0) {
            const randomID = Globals.randomID();
            const now = Moment();
            const saveDate = [now.year(),
                            now.month(),
                            now.day(),
                            now.hours(),
                            now.minutes(),
                            now.seconds()];
            loadedData[randomID] = {
                id: randomID,
                title: title,
                created: saveDate,
                pages: [],
                creator: firebase.auth().currentUser == null ? '' : firebase.auth().currentUser.uid
            };
            notebooks = Object.values(loadedData).filter((val, _, __) => val.pages);

            currentNotebook = loadedData[randomID];

            showActionAlert(`Created a new notebook called <b>${title}</b>`, 'gray');
            return;
        } else if(type === 1) {
            const randomID = Globals.randomID();
            const now = Moment();
            const saveDate = [now.year(), now.month(), now.day(), now.hours(), 
                            now.minutes(), now.seconds()];
            loadedData[randomID] = {
                id: randomID,
                title: title,
                created: saveDate,
                notebook: currentNotebook.id,
                content: "",
                creator: firebase.auth().currentUser == null ? '' : firebase.auth().currentUser.uid
            };
            loadedData[currentNotebook.id].pages.push(randomID);
            notebooks = Object.values(loadedData).filter((val, _, __) => val.pages);
            notes = Object.values(loadedData).filter((val, _, __) => val.notebook);

            currentNote = loadedData[randomID];

            const titleField = document.getElementById('title-field');
            const noteField = document.getElementById('note-field');
            titleField.value = title;
            noteField.innerHTML = '';

            showActionAlert(`Created a new note called <b>${title}</b>`, 'gray');
        }
    });
}
const _saveButton = () => {
    localSave();
    onlineSave(true, () => {});
}
const _printButton = () => {
    window.print();
}
const _shareButton = () => {
    if(!currentNote) {
        showActionAlert('Select a note to share', '#ea4d4d');
        return;
    }

    const titleField = document.getElementById('title-field');
    const noteField = document.getElementById('note-field');
    Globals.showShareAlert(body, titleField.value, noteField.innerHTML, (filename) => {
        showActionAlert(`Exported to <b>${filename}</b>`, '#73BE4D');
    });
}
const _notebooksButton = () => {
    // Remove any exisiting containers.
    $('.notes-view').remove();

    // Show the notes window.
    var transition = -10;
    switch(currentContext) {
        case Contexts.View: transition = -10; break;
        case Contexts.Selection: transition = -165; break;
        case Contexts.Insert: transition = -138; break;
        case Contexts.Settings: transition = -105; break;
    }

    // Show all the notebooks.
    const nbbtn = document.getElementById('vcm-notebooks-btn');
    const container = document.createElement('div');
    container.className = 'notes-view';
    container.style.top = '50px';
    container.style.left = `${nbbtn.style.left}px`;
    container.style.transform = `translateX(${transition}%)`;
    
    const title = document.createElement('p');
    title.className = 'notes-view-title';
    title.innerHTML = 'Notebooks';

    const list = document.createElement('ul');
    list.className = 'notes-view-list';
    
    // Make all the notebooks from the data.
    for(var i = 0; i < notebooks.length; i++) {
        const nb = notebooks[i];
        const li = document.createElement('li');
        li.innerHTML = `${nb.title}`;
        li.onclick = () => {
            currentNotebook = nb;
            showActionAlert(`Current Notebook: <b>${nb.title}</b>`, '#60A4EB');
        }

        list.appendChild(li);
    }
    
    container.appendChild(title);
    container.appendChild(list);
    body.appendChild(container);
}
const _notesButton = () => {
    if(!currentNotebook) return;

    // Remove any exisiting containers.
    $('.notes-view').remove();

    // Show the notes window.
    var transition = -10;
    switch(currentContext) {
        case Contexts.View: transition = -10; break;
        case Contexts.Selection: transition = -165; break;
        case Contexts.Insert: transition = -138; break;
        case Contexts.Settings: transition = -105; break;
    }

    // Show all the notebooks.
    const nbbtn = document.getElementById('vcm-notebooks-btn');
    const container = document.createElement('div');
    container.className = 'notes-view';
    container.style.top = '50px';
    container.style.left = `${nbbtn.style.left}px`;
    container.style.transform = `translateX(${transition}%)`;
    
    const title = document.createElement('p');
    title.className = 'notes-view-title';
    title.innerHTML = `${currentNotebook.title}`;

    const list = document.createElement('ul');
    list.className = 'notes-view-list';
    
    // Make all the notebooks from the data.
    const _notes = notes.filter((note, _, __) => note.notebook === currentNotebook.id);
    for(var i = 0; i < _notes.length; i++) {
        const nt = _notes[i];
        const li = document.createElement('li');
        li.innerHTML = `${nt.title}`;
        li.onclick = () => {
            currentNote = nt;
            openNote(nt);
        }

        list.appendChild(li);
    }
    
    container.appendChild(title);
    container.appendChild(list);
    body.appendChild(container);
}

const _undoButton = () => { document.execCommand('undo'); }
const _redoButton = () => { document.execCommand('redo'); }
const _cutButton = () => { document.execCommand('cut'); }
const _copyButton = () => { document.execCommand('copy'); }
const _pasteButton = () => { document.execCommand('paste'); }
const _selectAllButton = () => { document.execCommand('selectAll'); }

const _codeButton = () => {
    const code = `<pre class='code-segment'><code>var x = 5;</code></pre>`;
    document.execCommand('insertHTML', false, `<br>${code}<br>`);
}
const _bulletedListButton = () => { document.execCommand('insertUnorderedList'); }
const _numberedListButton = () => { document.execCommand('insertOrderedList'); }
const _checkboxButton = () => {
    document.execCommand('insertHTML', 
                        false, 
                        '<p><input class="checkbox" type="checkbox"><label>Checkbox Item</label></p><br/>');
    
    const checks = document.getElementsByClassName('checkbox');
    for(var i = 0; i < checks.length; i++) {
        const item = checks[i];
        
        item.onchange = () => {
            item.setAttribute('checked', item.checked);
        }
    }
}
const _imageButton = () => {
    const fileTask = document.createElement('input');
    fileTask.type = 'file';
    $(fileTask).trigger('click');
    fileTask.onchange = (e) => {
        const uploaded = fileTask.files[0];
        if(uploaded) {
            const img = `<br><img src='${uploaded.path}' alt='Image Not Found'><br>`;
            document.execCommand('insertHTML', false, `${img}`);
        }
    }
}

const _boldButton = () => { document.execCommand('bold'); }
const _italicButton = () => { document.execCommand('italic'); }
const _underlineButton = () => { document.execCommand('underline'); }
const _highlightButton = () => { 
    document.execCommand('useCSS', false, false);
    document.execCommand('hiliteColor', false, 'yellow');
}
const _subscriptButton = () => { document.execCommand('subscript'); }
const _superscriptButton = () => { document.execCommand('superscript'); }

const _accountButton = () => {
    Globals.showAccountAlert(body, (type) => {
        if(type === 0) {
            showActionAlert('Password reset email sent!', 'gray');
        } else if(type === 1) {
            const home = require(`${__dirname}/../js/Home.js`);
            pager.goTo(home);
        }
    })
}
const _backupButton = () => {
    const { dialog } = require('electron').remote;
    dialog.showOpenDialog(null, {
        properties: ['openDirectory']
    }, (paths) => {
        if(paths === undefined) return;
            
        // Create a folder for the notes.
        const path = paths[0] + '/Noteworthy';
        fs.mkdir(path, () => {
            // Write files for each note to this folder.
            const fileName = path + '/NoteworthyBackup' + Date.now() + '.nbackup';
            fs.writeFileSync(fileName, JSON.stringify(loadedData), 'utf8');

            showActionAlert('Exported all notebooks and notes to backup file!', '#73BE4D');
        });
    });
}
const _retrieveBackupButton = () => {
    dialog.showOpenDialog(null, {
        properties: ['openFile'],
        filters: [{name: 'nbackup', extensions: ['nbackup']}]
    }, (paths) => {
        if(!paths) return;
        if(paths.length === 0) return;

        const data = JSON.parse(fs.readFileSync(paths[0], 'utf8'));
        const nbs = Object.values(data).filter((val, _, __) => val.pages);
        const nts = Object.values(data).filter((val, _, __) => val.notebook);
        loadedData = data;
        notebooks = nbs;
        notes = nts;

        showActionAlert('Successfully loaded all notebooks and notes from backup!', 'gray');
    });
}



/************************
*                       *
*         EVENTS        *
*                       *
*************************/

BrowserWindow.getFocusedWindow().on('new', (event, command) => {
    _newButton();
});

BrowserWindow.getFocusedWindow().on('save', (event, command) => {
    _saveButton();
});

BrowserWindow.getFocusedWindow().on('print', (event, command) => {
    _printButton();
});

BrowserWindow.getFocusedWindow().on('share', (event, command) => {
    _shareButton();
});

BrowserWindow.getFocusedWindow().on('undo', (event, command) => {
    _undoButton();
});

BrowserWindow.getFocusedWindow().on('redo', (event, command) => {
    _redoButton();
});

BrowserWindow.getFocusedWindow().on('cut', (event, command) => {
    _cutButton();
});

BrowserWindow.getFocusedWindow().on('copy', (event, command) => {
    _copyButton();
});

BrowserWindow.getFocusedWindow().on('paste', (event, command) => {
    _pasteButton();
});

BrowserWindow.getFocusedWindow().on('select-all', (event, command) => {
    _selectAllButton();
});

BrowserWindow.getFocusedWindow().on('code-segment', (event, command) => {
    _codeButton();
});

BrowserWindow.getFocusedWindow().on('bulleted-list', (event, command) => {
    _bulletedListButton();
});

BrowserWindow.getFocusedWindow().on('numbered-list', (event, command) => {
    _numberedListButton();
});

BrowserWindow.getFocusedWindow().on('checkbox', (event, command) => {
    _checkboxButton();
});

BrowserWindow.getFocusedWindow().on('image', (event, command) => {
    _imageButton();
});

BrowserWindow.getFocusedWindow().on('bold', (event, command) => {
    _boldButton();
});

BrowserWindow.getFocusedWindow().on('italic', (event, command) => {
    _italicButton();
});

BrowserWindow.getFocusedWindow().on('underline', (event, command) => {
    _underlineButton();
});

BrowserWindow.getFocusedWindow().on('highlight', (event, command) => {
    _highlightButton();
});

BrowserWindow.getFocusedWindow().on('subscript', (event, command) => {
    _subscriptButton();
});

BrowserWindow.getFocusedWindow().on('superscript', (event, command) => {
    _superscriptButton();
});

BrowserWindow.getFocusedWindow().on('goto-account', (event, command) => {
    _accountButton();
});

BrowserWindow.getFocusedWindow().on('save-online', (event, command) => {
    _saveButton();
});

BrowserWindow.getFocusedWindow().on('load-online', (event, command) => {
    onlineLoad();
});

BrowserWindow.getFocusedWindow().on('backup', (event, command) => {
    _backupButton();
});

BrowserWindow.getFocusedWindow().on('retrieve-backups', (event, command) => {
    _retrieveBackupButton();
});

BrowserWindow.getFocusedWindow().on('switch-context', (event, command) => {
    switchContext();
    updateContextMenu(true);
})

BrowserWindow.getFocusedWindow().on('quick-move-left', (event, command) => {
    const previousNoteButton = document.getElementById('vcm-previous-note-btn');
    const nextNoteButton = document.getElementById('vcm-next-note-btn');
    const currentNotes = notes.filter((nt) => nt.notebook === currentNotebook.id);
    const titleField = document.getElementById('title-field');
    const noteField = document.getElementById('note-field');

    const index = currentNote ? currentNotes.indexOf(currentNote) : 1;
    if(index - 1 >= 0) {
        currentNote = currentNotes[index - 1];
        titleField.value = currentNote.title;
        noteField.innerHTML = currentNote.content;
        showActionAlert(`Opened <b>${currentNote.title}</b>`, '#60A4EB');
    }

    updateNotesQuickMove(previousNoteButton, nextNoteButton, currentNotes);
})

BrowserWindow.getFocusedWindow().on('quick-move-right', (event, command) => {
    const previousNoteButton = document.getElementById('vcm-previous-note-btn');
    const nextNoteButton = document.getElementById('vcm-next-note-btn');
    const currentNotes = notes.filter((nt) => nt.notebook === currentNotebook.id);
    const titleField = document.getElementById('title-field');
    const noteField = document.getElementById('note-field');

    const index = currentNote ? currentNotes.indexOf(currentNote) : 1;
    if(index + 1 < currentNotes.length) {
        currentNote = currentNotes[index + 1];
        titleField.value = currentNote.title;
        noteField.innerHTML = currentNote.content;
        showActionAlert(`Opened <b>${currentNote.title}</b>`, '#60A4EB');
    }

    updateNotesQuickMove(previousNoteButton, nextNoteButton, currentNotes);
})

module.exports = {
    init: init,
    onlineSave: onlineSave
}