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

const worker = new Worker(`${__dirname}/AsyncCode.js`);
worker.addEventListener('message', (event) => {
    if(currentNote) { saveNote(false, true); }
});


/************************
*                       *
*       VARIABLES       *
*                       *
*************************/

// The notes that have been loaded from the database.
var loadedData;
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
var actionsView;

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
            worker.postMessage(0);
        }, 1500);
    }
    // contentField.onkeydown = (e) => {
    //     if(e.keyCode === 9) {
    //         document.execCommand('insertText', false, '\t');
    //     }
    // }
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
    body.onclick = () => {
        Globals.hideContextMenu(body);
    }
    contentField.addEventListener('contextmenu', (e) => {
        Globals.showContextMenu(body, e);
    })

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
    actionsView = document.getElementById('')
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
            notesView.style.right = '-500px';
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
const popoulateNotes = (updating = false) => {
    if(currentNotebook == null) return;

    if(updating === false) {
        // If you are not updating, remap ALL of the notes.
        const notes = currentNotebook.pages;
        const a = Globals.mapNoteToTableCell(notes, (val) => {
            currentNote = val;
            titleField.value = val.title;

            contentField.innerHTML = Globals.toHTML(val.content);
            toggleNotebooks();
        }, (val) => {

        });

        notesView.innerHTML = '';
        for(var i in a) { notesView.appendChild(a[i]); }
    }
    else {
        if(currentNote === null) return;

        // If updating, only update the current note.
        const a = Globals.mapOneNoteToTableCell(currentNote, (val) => {
            currentNote = val;
            titleField.value = val.title;

            contentField.innerHTML = Globals.toHTML(val.content);
            toggleNotebooks();
        }, (val) => {
            
        })

        const view = $(`[noteID=${currentNote.id}]`);
        view.replaceWith(a);
    }
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

            contentField.innerHTML = Globals.toHTML(val.content);
            toggleNotebooks();
        }, (val) => {
            
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
        }, (val) => {
            
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

/** Does a final save by taking the json of the notes and notebooks and
* saves them to a file. */
const finalSave = (withAlert = true) => {
    const data = JSON.stringify(loadedData);
    fs.writeFileSync(`${__dirname}/../../Database.json`, data, 'utf8');

    if(withAlert === true) {
        setTimeout(() => {
            alertify.success('Saving...');
        }, 4000);
    }
}

/** Saves a note to the local database. Later on the notes can be synced so that
* there is a copy on all devices. */
const saveNote = (withAlerts = true, updating = false) => {
    if(currentNote == null) {
        alertify.error('Try creating a page inside of a notebook to save.');
        return;
    }

    // Remove the highlights from searching.
    var search = document.getElementById('findReplaceHighlight');
    if(search) $(search).replaceWith(search.innerHTML);

    const newTitle = titleField.value;
    const content = contentField.innerHTML;
    var newContent = Globals.toMarkDown(content)//.replace(/\n/g, '<br/>');

    if(currentNote.id in loadedData) {
        loadedData[currentNote.id].title = newTitle;
        loadedData[currentNote.id].content = newContent;
    } else {
        loadedData[currentNote.id] = {
            id: currentNote.id,
            title: newTitle,
            timestamp: currentNote.timestamp,
            notebook: currentNotebook.id,
            content: newContent,
            creator: firebase.auth().currentUser == null ? '' : firebase.auth().currentUser.uid
        }
    }
    
    popoulateNotes(updating);
    if(withAlerts === true) alertify.success('Saved!');
}


/** Loads the notebooks and notes from the local database. */
const loadNotes = () => {
    const json = JSON.parse(fs.readFileSync(`${__dirname}/../../Database.json`));
    const nbs = Object.values(json).filter((val, _, __) => val.pages);
    loadedData = json;
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
    const randomID = Globals.randomID();
    loadedData[randomID] = {
        id: randomID,
        title: title,
        created: new Date(),
        pages: [],
        creator: firebase.auth().currentUser == null ? '' : firebase.auth().currentUser.uid
    };
    populateNotebooks();
}


/** Adds a new note to a specific notebook in the database. */
const addNote = (title) => {
    const randomID = Globals.randomID();
    loadedData[randomID] = {
        id: randomID,
        title: title,
        timestamp: new Date(),
        notebook: currentNotebook.id,
        content: "",
        creator: firebase.auth().currentUser == null ? '' : firebase.auth().currentUser.uid
    };
    loadedData[currentNotebook.id].pages.push(randomID);
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
        contentField.innerHTML = Globals.toHTML(cntnt);
        findRepOpen = false;
    }
});
BrowserWindow.getFocusedWindow().on('save', (event, command) => {
    saveNote();
    finalSave(false);
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
    const toExport = Globals.toMarkDown(contentField.innerHTML)//.replace(/\n/g, '<br/>');
    dialog.showSaveDialog(null, {
        title: 'Untitled.txt',
        filters: [{name: 'txt', extensions: ['txt']}]
    }, (filename) => {
        fs.writeFileSync(filename, toExport, 'utf8');
        alertify.success(`Exported to ${filename}!`);
    });
});
BrowserWindow.getFocusedWindow().on('export-md', (event, command) => {
    const toExport = Globals.toMarkDown(contentField.innerHTML)//.replace(/\n/g, '<br/>');
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
    const code = `<pre class='code-segment'><code>var x = 5;</code></pre>`;
    document.execCommand('insertHTML', false, `<br>${code}<br>`);
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
BrowserWindow.getFocusedWindow().on('strikethrough', (event, command) => {
    document.execCommand('strikethrough');
});
BrowserWindow.getFocusedWindow().on('highlight', (event, command) => {
    // if(currentNote == null) return;
    // const sel = document.getSelection();
    // const range = sel.getRangeAt(0);
    // const hl = document.createElement('mark');
    // range.surroundContents(hl);
    // saveNote(false, true);
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

        finalSave(false);
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
    firebase.database().ref().orderByChild('creator').equalTo(uid).once('value', (snap) => {
        const allNotebooksAndNotes = snap.val();
        if(allNotebooksAndNotes == null) { return }

        // 1.) Get everything from the remote database and put it in the local database.
        const allNotebooks = allNotebooksAndNotes.filter((val, _, __) => !val.notebook);
        const allNotes = allNotebooksAndNotes.filter((val, _, __) => val.notebook);
        const tempNotes = notebooks.map((val, _, __) => val.pages);

        /**
     * 
     * todo
     * 
     */
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

        // 2.) Save the local database to firebase by updating all the objects with ids.
        const json = JSON.parse(fs.readFileSync(`${__dirname}/../../Database.json`));
        /* Save to firebase. */

        console.log(notebooks);
    });
});




module.exports = {
    init: init,
    save: finalSave
}