/************************
*                       *
*        REQUIRES       *
*                       *
*************************/

const fs = require('fs');
const $ = require('jquery');
const marked = require('marked');
const turndown = require('turndown');
const firebase = require('firebase');
const Globals = require('../../Globals.js');
const remote = require('electron').remote;
const BrowserWindow = remote.BrowserWindow;
const { dialog } = require('electron').remote;
const alertify = require('alertify.js');

const tdService = new turndown();

/************************
*                       *
*       VARIABLES       *
*                       *
*************************/

// The notes that have been loaded from the database.
var notebooks;
var currentNotebook;
var currentNote;

// The root body and the page manager.
var body;
var pager;

// The view that holds the main work area.
var workView;

// The notebooks table view where all of the notebooks and notes are displayed.
var backButton;
var notebooksView;
var notesView;

// The title field.
var titleField;

// The content field.
var contentField;

// The search bar.
var searchBar;

// The button to open notebooks.
var notesButton;

// The button to create a new notebook or note.
var createNewButton;

// Whether or not the notebooks view is open.
var notebookViewIsOpen = false;
var notesViewIsOpen = false;

// Whether or not the find replace window is open.
var findRepOpen = false;





/************************
*                       *
*          INIT         *
*                       *
*************************/

/** Start the home page actions. */
const init = (root, pageManager) => {
    body = root;
    pager = pageManager;

    Globals.loadHTMLInto('Work.html', root);
    setupRefs();

    // Button clicks.
    contentField.oninput = () => {
        setTimeout(() => {
            if(currentNote) { saveNote(false); }
        }, 1500);
    }
    notesButton.onclick = toggleNotebooks;
    searchBar.oninput = handleSearch;
    backButton.onclick = () => {
        currentNotebook = null;
        toggleNotes();
    }
    createNewButton.onclick = () => {
        if(notesViewIsOpen === true) {
            Globals.showCreateNewAlert(body, 'Note', addNote);
        }
        else if(notebookViewIsOpen === true) {
            Globals.showCreateNewAlert(body, 'Notebook', addNotebook);
        } 
    }

    // Load the notebooks and their notes.
    loadNotes();
    populateNotebooks();
}

/** Gets the references to all of the variables. */
const setupRefs = () => {
    titleField = document.getElementById('titleField');
    contentField = document.getElementById('contentField');
    notesButton = document.getElementById('notesButton');
    workView = document.getElementById('workView');
    backButton = document.getElementById('notebooksBackButton');
    notebooksView = document.getElementById('notebooksTableView');
    notesView = document.getElementById('notesTableView');
    createNewButton = document.getElementById('addButton');
    searchBar = document.getElementById('notebooksSearchField');
}





/************************
*                       *
*       FUNCTIONS       *
*                       *
*************************/

/** Toggles the notebook view when the button is clicked. */
const toggleNotebooks  = () => {
    notebookViewIsOpen = !notebookViewIsOpen;
    
    const titleBar = document.getElementsByClassName('titleBar')[0];
    
    switch(notebookViewIsOpen) {
        case true:
            workView.style.right = '300px';
            titleField.style.left = '-300px';
            contentField.style.left = '-300px';
            titleBar.style.right = '300px';
            break;
        case false:
            workView.style.right = '0px';
            titleField.style.left = '0px';
            contentField.style.left = '0px';
            titleBar.style.right = '0px';
            break;
    }
}

/** Toggles the notes view when a cell is clicked. */
const toggleNotes  = (val) => {
    notesViewIsOpen = !notesViewIsOpen;

    const nbTitleBar = document.getElementById('notebooksTitleLabel');
    if(val) {
        nbTitleBar.innerHTML = `${val.title.length > 19 ? val.title.substring(0, 19) + '...' : val.title}`;
        popoulateNotes();
    } else {
        nbTitleBar.innerHTML = 'Notebooks';
    }

    switch(notesViewIsOpen) {
        case true:
            backButton.style.display = 'inline-block';
            nbTitleBar.style.width = '70%';
            notebooksView.style.right = '300px';
            notesView.style.right = '0px';
            break;
        case false:
            backButton.style.display = 'none';
            nbTitleBar.style.width = '80%';
            notebooksView.style.right = '0px';
            notesView.style.right = '-300px';
            break;
    }
}

/** Populates the notebooks view with new data. */
const populateNotebooks = () => {
    const a = Globals.mapNotebookToTableCell(notebooks, (val) => {
        currentNotebook = val;
        toggleNotes(val);
    });

    notebooksView.innerHTML = '';
    for(var i in a) { notebooksView.appendChild(a[i]); }
}

/** Populates the notes view with new data. */
const popoulateNotes = () => {
    if(currentNotebook == null) return;

    const notes = currentNotebook.pages;
    const a = Globals.mapNoteToTableCell(notes, (val) => {
        currentNote = val;
        titleField.value = val.title;

        marked(val.content, (err, resp) => {
            if(err) { contentField.innerHTML = err; return; }
            contentField.innerHTML = resp;
            toggleNotebooks();
        });
    });

    notesView.innerHTML = '';
    for(var i in a) { notesView.appendChild(a[i]); }
}


/** Populate with searches. */
const handleSearch = () => {
    const search = searchBar.value;
    if(search === '') {
        populateNotebooks();
        popoulateNotes();
    }

    if(notesViewIsOpen === true) {
        // Populate, but with filtered results.
        if(currentNotebook == null) return;

        const notes = currentNotebook.pages.filter((val,_,__) => {
            return val.title.includes(search);
        });
        const a = Globals.mapNoteToTableCell(notes, (val) => {
            currentNote = val;
            titleField.value = val.title;

            marked(val.content, (err, resp) => {
                if(err) { contentField.innerHTML = err; return; }
                contentField.innerHTML = resp;
                toggleNotebooks();
            });
        });

        notesView.innerHTML = '';
        for(var i in a) { notesView.appendChild(a[i]); }
    }
    else if(notebookViewIsOpen === true) {
        if(notebooks === null || notebooks === undefined) return;

        const nbs = notebooks.filter((val, _, __) => {
            return val.title.includes(search);
        });
        const a = Globals.mapNotebookToTableCell(nbs, (val) => {
            currentNotebook = val;
            toggleNotes(val);
        });
    
        notebooksView.innerHTML = '';
        for(var i in a) { notebooksView.appendChild(a[i]); }
    }
}



/************************
*                       *
*        HELPERS        *
*                       *
*************************/

/** Saves a note to the local database. Later on the notes can be synced so that
* there is a copy on all devices. */
const saveNote = (withAlerts = true) => {
    if(currentNote == null) {
        alertify.error('Try creating a page inside of a notebook to save.');
        return;
    }

    const newTitle = titleField.value;
    const content = contentField.innerHTML.replace('<mark>', '').replace('</mark>', '');
    var newContent = tdService.turndown(content).replace(/\n/g, '<br/>');

    const json =  JSON.parse(fs.readFileSync(`${__dirname}/../../Database.json`));
    if(currentNote.id in json) {
        json[currentNote.id].title = newTitle;
        json[currentNote.id].content = newContent;
    } else {
        json[currentNote.id] = {
            id: currentNote.id,
            title: newTitle,
            timestamp: currentNote.timestamp,
            notebook: currentNotebook.id,
            content: newContent,
            creator: firebase.auth().currentUser == null ? '' : firebase.auth().currentUser.uid
        }
    }
    
    fs.writeFileSync(`${__dirname}/../../Database.json`, JSON.stringify(json), 'utf8');
    loadNotes();
    popoulateNotes();

    if(withAlerts === true) alertify.success('Saved!');
}


/** Loads the notebooks and notes from the local database. */
const loadNotes = () => {
    const json = JSON.parse(fs.readFileSync(`${__dirname}/../../Database.json`));
    const nbs = Object.values(json).filter((val, _, __) => val.pages);
    notebooks = nbs;

    // Go through each notebooks and get the notes.
    for(var i in nbs) {
        const notesI = Object.values(json).filter((val, _, __) => {
            return val.notebook === notebooks[i].id
        });
        notebooks[i].pages = notesI;
        
        // Reload the current notebook.
        if(currentNotebook && notebooks[i].id === currentNotebook.id) {
            currentNotebook.pages = notesI;
        }
    }
}


/** Adds a new notebook to the database. */
const addNotebook = (title) => {
    const json =  JSON.parse(fs.readFileSync(`${__dirname}/../../Database.json`));
    const randomID = Globals.randomID();
    json[randomID] = {
        id: randomID,
        title: title,
        created: new Date(),
        pages: [],
        creator: firebase.auth().currentUser == null ? '' : firebase.auth().currentUser.uid
    };
    fs.writeFileSync(`${__dirname}/../../Database.json`, JSON.stringify(json), 'utf8');
    loadNotes();
    populateNotebooks();
}


/** Adds a new note to a specific notebook in the database. */
const addNote = (title) => {
    const json =  JSON.parse(fs.readFileSync(`${__dirname}/../../Database.json`));
    const randomID = Globals.randomID();
    json[randomID] = {
        id: randomID,
        title: title,
        timestamp: new Date(),
        notebook: currentNotebook.id,
        content: "",
        creator: firebase.auth().currentUser == null ? '' : firebase.auth().currentUser.uid
    };
    json[currentNotebook.id].pages.push(randomID);
    fs.writeFileSync(`${__dirname}/../../Database.json`, JSON.stringify(json), 'utf8');
    loadNotes();
    popoulateNotes();
}




/************************
*                       *
*         EVENTS        *
*                       *
*************************/

BrowserWindow.getFocusedWindow().on('undo', (event, command) => {
    document.execCommand('undo');
});
BrowserWindow.getFocusedWindow().on('redo', (event, command) => {
    document.execCommand('redo');
});
BrowserWindow.getFocusedWindow().on('cut', (event, command) => {
    document.execCommand('cut');
});
BrowserWindow.getFocusedWindow().on('copy', (event, command) => {
    document.execCommand('copy');
});
BrowserWindow.getFocusedWindow().on('paste', (event, command) => {
    document.execCommand('paste');
});
BrowserWindow.getFocusedWindow().on('select-all', (event, command) => {
    document.execCommand('selectAll');
});
BrowserWindow.getFocusedWindow().on('find-replace', (event, command) => {
    const cntnt = currentNote === null ? '' : currentNote.content;

    if(findRepOpen === false) {
        Globals.showFindReplaceAlert(body, 
                                    cntnt, 
                                    contentField, 
                                    () => { findRepOpen = false },
                                    (cont) => {
                                        currentNote.content = cont;
                                    });
        findRepOpen = true;
    } else {
        $('#findReplaceAlert').animate({
            bottom: '0px',
            opacity: '0'
        }, '0.1s ease-out', () => {
            Globals.hideFindReplaceAlert(body);
        });
        marked(cntnt, (err, resp) => {
            if(!err) contentField.innerHTML = resp;
        });
        findRepOpen = false;
    }
});
BrowserWindow.getFocusedWindow().on('save', (event, command) => {
    saveNote();
});
BrowserWindow.getFocusedWindow().on('print', (event, command) => {
    window.print();
});
BrowserWindow.getFocusedWindow().on('share-email', (event, command) => {
    if(currentNote == null) {
        alertify.log('Try opening up a note to use the share feature');
        return;
    }
    Globals.showShareAlert(body, currentNote, contentField.innerHTML);
});
BrowserWindow.getFocusedWindow().on('export-txt', (event, command) => {
    const toExport = tdService.turndown(contentField.innerHTML).replace(/\n/g, '<br/>');
    dialog.showSaveDialog(null, {
        title: 'Untitled.txt',
        filters: [{name: 'txt', extensions: ['txt']}]
    }, (filename) => {
        fs.writeFileSync(filename, toExport, 'utf8');
        alertify.success(`Exported to ${filename}!`);
    });
});
BrowserWindow.getFocusedWindow().on('export-md', (event, command) => {
    const toExport = tdService.turndown(contentField.innerHTML).replace(/\n/g, '<br/>');
    dialog.showSaveDialog(null, {
        title: 'Untitled.md',
        filters: [{name: 'md', extensions: ['md']}]
    }, (filename) => {
        fs.writeFileSync(filename, toExport, 'utf8');
        alertify.success(`Exported to ${filename}!`);
    });
});
BrowserWindow.getFocusedWindow().on('export-html', (event, command) => {
    const toExport = contentField.innerHTML;
    dialog.showSaveDialog(null, {
        title: 'Untitled.html',
        filters: [{name: 'html', extensions: ['html']}]
    }, (filename) => {
        fs.writeFileSync(filename, toExport, 'utf8');
        alertify.success(`Exported to ${filename}!`);
    });
});
BrowserWindow.getFocusedWindow().on('subscript', (event, command) => {
    document.execCommand('subscript');
});
BrowserWindow.getFocusedWindow().on('superscript', (event, command) => {
    document.execCommand('superscript');
});
BrowserWindow.getFocusedWindow().on('bulleted-list', (event, command) => {
    document.execCommand('insertUnorderedList');
});
BrowserWindow.getFocusedWindow().on('numbered-list', (event, command) => {
    document.execCommand('insertOrderedList');
});
BrowserWindow.getFocusedWindow().on('code-segment', (event, command) => {
    const bgColor = 'background-color: rgb(229, 229, 229);';
    const font = 'font-family: Monospace; font-size: 15px;';
    const codeSegment = '<div class="codeSegmentArea" contentEditable="true" tabindex="1" style="' + bgColor + font + '">Start typing code here</div>';
    document.execCommand('insertHTML', true, '<br>' + codeSegment + '<br>');
});
BrowserWindow.getFocusedWindow().on('bold', (event, command) => {
    document.execCommand('bold');
});
BrowserWindow.getFocusedWindow().on('italic', (event, command) => {
    document.execCommand('italic');
});
BrowserWindow.getFocusedWindow().on('underline', (event, command) => {
    document.execCommand('underline');
});
BrowserWindow.getFocusedWindow().on('align-left', (event, command) => {
    document.execCommand('justifyLeft');
});
BrowserWindow.getFocusedWindow().on('align-center', (event, command) => {
    document.execCommand('justifyCenter');
});
BrowserWindow.getFocusedWindow().on('align-right', (event, command) => {
    document.execCommand('justifyRight');
});
BrowserWindow.getFocusedWindow().on('highlight', (event, command) => {
    // TODO
});
BrowserWindow.getFocusedWindow().on('goto-account', (event, command) => {
    Globals.showAccountAlert(body, () => {
        if(currentNote) saveNote();
        
        const home = require(`${__dirname}/../js/Home.js`);
        Globals.logout(() => {
            pager.goTo(home);
        }, (err) => { 
            pager.goTo(home);
        });
    });
});
BrowserWindow.getFocusedWindow().on('backup', (event, command) => {
    if(!notebooks) { return; }
    
    Globals.showBackupAlert(body, notebooks);
});
BrowserWindow.getFocusedWindow().on('retrieve-backups', (event, command) => {
    dialog.showOpenDialog(null, {
        properties: ['openFile'],
        filters: [{name: 'nbackup', extensions: ['nbackup']}]
    }, (paths) => {
        if(paths.length === 0) return;

        const data = JSON.parse(fs.readFileSync(paths[0], 'utf8'));
        fs.writeFileSync(`${__dirname}/../../Database.json`, JSON.stringify(data), 'utf8');
        loadNotes();
        populateNotebooks();
        alertify.success('Successfully loaded notebooks and notes from backup!');
    });
});
BrowserWindow.getFocusedWindow().on('open-note-view', (event, command) => {
    toggleNotebooks();
});
BrowserWindow.getFocusedWindow().on('sync', (event, command) => {
    if(!firebase.auth().currentUser) return;
    loadNotes();

    const uid = firebase.auth().currentUser.uid;
    firebase.database().ref().orderByChild('creator')
                            .equalTo(uid)
                            .once('value', (snap) => {
        const allNotebooksAndNotes = snap.val();
        if(allNotebooksAndNotes == null) { return }

        // 1.) Get everything from the remote database and put it in the local database.
        const allNotebooks = allNotebooksAndNotes.filter((val, _, __) => !val.notebook);
        const allNotes = allNotebooksAndNotes.filter((val, _, __) => val.notebook);
        const tempNotes = notebooks.map((val, _, __) => val.pages);

        for(var id in allNotebooks) {
            // If the local database does not have the notebook, add it.
            if(!(id in notebooks)) notebooks.push(allNotebooks[id]);
        }
        for(var nID in allNotes) {
            const nt = allNotes[nID];

            // If the local db doesn't have the note, add it to the local db
            // and add it to its notebook.
            if(!(nID in tempNotes)) {
                notebooks[nt.notebook].pages.push(nID);
            }
        }

        // 2.) Take what is not already in the remote db from the local db and
        // put it on the remote one.
        const json = JSON.parse(fs.readFileSync(`${__dirname}/../../Database.json`));
        for(var i in json) {
            const item = json[i];

            if(!(item.id in allNotebooksAndNotes)) {
                // Push either a notebook or a note and note id to the database.
            }
        }

        console.log(notebooks);
    });
});




module.exports = {
    init: init,
    save: saveNote
}