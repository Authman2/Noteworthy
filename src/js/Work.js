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
    // if(currentNote) { saveNote(false, true); }
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
var currentNotebook;
var currentNote;

// Button clicks.
var cmdClicked = false;

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
    
    // noteField.oninput = () => {
    //     setTimeout(() => {
    //         worker.postMessage(0);
    //     }, 1500);
    // }
    document.onmousedown = (e) => {
        noteField.focus();
    }
    
    setupRefs();
    updateContextMenu();
}

/** Gets the references to all of the variables. */
const setupRefs = () => {
    vcm = fs.readFileSync(`${__dirname}/../html/contexts/ViewContextMenu.html`, 'utf8');
    secm = fs.readFileSync(`${__dirname}/../html/contexts/SelectionContextMenu.html`, 'utf8');
    icm = fs.readFileSync(`${__dirname}/../html/contexts/InsertContextMenu.html`, 'utf8');
    stcm = fs.readFileSync(`${__dirname}/../html/contexts/SettingsContextMenu.html`, 'utf8');
}

/** Updates the view depending on the type of context menu. */
const updateContextMenu = () => {
    $('.context-menu').remove();
    
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
    const previousNoteButton = document.getElementById('vcm-previous-note-btn');
    const nextNoteButton = document.getElementById('vcm-next-note-btn');
    const newButton = document.getElementById('vcm-new-btn');
    const shareButton = document.getElementById('vcm-share-btn');
    const notebooksButton = document.getElementById('vcm-notebooks-btn');
    const notesButton = document.getElementById('vcm-notes-btn');

    newButton.onclick = () => {
        
    }
    shareButton.onclick = () => {

    }
    notebooksButton.onclick = () => {
        _notebooksButton();
    }
    notesButton.onclick = () => {
        _notesButton();
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

    }
    saveOnlineBtn.onclick = () => {

    }
    loadOnlineBtn.onclick = () => {

    }
}



/************************
*                       *
*        HELPERS        *
*                       *
*************************/

const _newButton = () => {

}

const _saveButton = () => {

}

const _printButton = () => {

}

const _shareButton = () => {

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
    list.innerHTML = `<li>A much longer title for testing</li><li>Working</li><li>Working</li><li>Working</li><li>Working</li><li>Working</li><li>Working</li><li>Working</li><li>Working</li><li>Working</li><li>Working</li><li>Working</li>`;
    
    container.appendChild(title);
    container.appendChild(list);
    body.appendChild(container);
}

const _notesButton = () => {

}

const _undoButton = () => { document.execCommand('undo'); }
const _redoButton = () => { document.execCommand('redo'); }
const _cutButton = () => { document.execCommand('cut'); }
const _copyButton = () => { document.execCommand('copy'); }
const _pasteButton = () => { document.execCommand('paste'); }
const _selectAllButton = () => { document.execCommand('selectAll'); }

const _findReplaceButton = () => {
    
}
const _codeButton = () => {
    const code = `<pre class='code-segment'><code>var x = 5;</code></pre>`;
    document.execCommand('insertHTML', false, `<br>${code}<br>`);
}
const _bulletedListButton = () => {
    document.execCommand('insertUnorderedList');
}
const _numberedListButton = () => {
    document.execCommand('insertOrderedList');
}
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

BrowserWindow.getFocusedWindow().on('find-replace', (event, command) => {
    _findReplaceButton();
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
});

BrowserWindow.getFocusedWindow().on('save-online', (event, command) => {
});

BrowserWindow.getFocusedWindow().on('load-online', (event, command) => {
});

BrowserWindow.getFocusedWindow().on('backup', (event, command) => {
});

BrowserWindow.getFocusedWindow().on('retrieve-backup', (event, command) => {
});

BrowserWindow.getFocusedWindow().on('switch-context', (event, command) => {
    switchContext();
    updateContextMenu();
})

module.exports = {
    init: init
}