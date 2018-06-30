/************************
*                       *
*        REQUIRES       *
*                       *
*************************/

const $ = require('jquery');
const fs = require('fs');
const marked = require('marked');
const turndown = require('turndown');
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
const saveNote = () => {
    if(currentNote == null) {
        alertify.error('Try creating a page inside of a notebook to save.');
        return;
    }

    const newTitle = titleField.value;
    const newContent = tdService.turndown(contentField.innerHTML).replace(/\n/g, '<br/>');

    const json =  JSON.parse(fs.readFileSync(`${__dirname}/../../Database.json`));
    json[currentNote.id].title = newTitle;
    json[currentNote.id].content = newContent;
    
    fs.writeFileSync(`${__dirname}/../../Database.json`, JSON.stringify(json), 'utf8');
    loadNotes();
    popoulateNotes();

    alertify.success('Saved!');
}


/** Loads the notebooks and notes from the local database. */
const loadNotes = () => {
    const json =  JSON.parse(fs.readFileSync(`${__dirname}/../../Database.json`));
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
        pages: []
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
        created: new Date(),
        notebook: currentNotebook.id,
        content: ""
    };
    json[currentNotebook.id].pages.push(randomID);
    fs.writeFileSync(`${__dirname}/../../Database.json`, JSON.stringify(json), 'utf8');
    loadNotes();
    popoulateNotes();
}


/** Checks if the user forgot to save before performing a new action. */
const forgotToSave = () => {
    return false;
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
    
});
BrowserWindow.getFocusedWindow().on('save', (event, command) => {
    saveNote();
});
BrowserWindow.getFocusedWindow().on('print', (event, command) => {
    window.print();
});
BrowserWindow.getFocusedWindow().on('share-email', (event, command) => {
    
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
BrowserWindow.getFocusedWindow().on('word-count', (event, command) => {
    
});
BrowserWindow.getFocusedWindow().on('subscript', (event, command) => {
    
});
BrowserWindow.getFocusedWindow().on('superscript', (event, command) => {
    
});
BrowserWindow.getFocusedWindow().on('bulleted-list', (event, command) => {
    
});
BrowserWindow.getFocusedWindow().on('numbered-list', (event, command) => {
    
});
BrowserWindow.getFocusedWindow().on('code-segment', (event, command) => {
    
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
    
});
BrowserWindow.getFocusedWindow().on('goto-account', (event, command) => {
    
});
BrowserWindow.getFocusedWindow().on('backup', (event, command) => {
    
});
BrowserWindow.getFocusedWindow().on('retrieve-backups', (event, command) => {
    
});
BrowserWindow.getFocusedWindow().on('open-note-view', (event, command) => {
    toggleNotebooks();
});




module.exports = {
    init: init,
    forgotToSave: forgotToSave
}