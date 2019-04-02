const $ = require('jquery');
const fs = require('fs');

const Mosaic = require('@authman2/mosaic').default;
const ContextMenu = require('../components/context-menu');
const NewPopup = require('../popups/new');
const SharePopup = require('../popups/share');
const NotebooksPopup = require('../popups/notebooks');
const AccountPopup = require('../popups/account');

const Globals = require('../other/Globals');
const portfolio = require('../portfolio');


/** The work page. */
const work = new Mosaic({
    portfolio,
    view: function() {
        return html`<div class='work'>
            ${ ContextMenu.new() }

            <div id='work-title-field' contenteditable='true'>Title</div>
            <div id='work-content-field' contenteditable='true'>Note</div>
        </div>`
    },
    created() {
        let user = firebase.auth().currentUser;
        if(user) Globals.showActionAlert(`Welcome, ${user.email}!`, Globals.ColorScheme.blue);

        Globals.loadData(loaded => {
            portfolio.dispatch('load-data', { loadedData: loaded });
        });

        document.oninput = (e) => {
            if(e.target.id === 'work-content-field') {
                setTimeout(() => {
                    this.actions.updateNote();
                }, 1500);
            }
        }
    },
    actions: {
        /** Updates the currently editing note. */
        updateNote() {
            let cn = portfolio.get('currentNote');
            if(!cn) return;

            let titleField = document.getElementById('work-title-field');
            let contentField = document.getElementById('work-content-field');

            portfolio.dispatch('update-note', {
                id: cn.id,
                title: titleField.innerHTML,
                content: contentField.innerHTML
            });
        }
    }
});


/* EVENTS */

export function makeNew() {
    portfolio.dispatch('show-alert', { alert: NewPopup.new() });
}
export function share() {
    let cn = portfolio.get('currentNote');
    if(!cn) {
        Globals.showActionAlert('You must select a note to share it.', Globals.ColorScheme.red);
        return;
    }
    portfolio.dispatch('show-alert', { alert: SharePopup.new({ title: cn.title, content: cn.content }) });
}
export function openNotebook() {
    let notebooks = Object.values(portfolio.get('loadedData')).filter(item => {
        return item.pages;
    });
    portfolio.dispatch('show-alert', { alert: NotebooksPopup.new({ type: 'Notebook', items: notebooks }) });
}
export function openNote() {
    let cnb = portfolio.get('currentNotebook');
    if(!cnb) {
        Globals.showActionAlert('You must select a notebook first before you can open any notes.', Globals.ColorScheme.red);
        return;
    }

    let notes = Object.values(portfolio.get('loadedData')).filter(item => {
        return !item.pages && item.notebook === cnb.id;
    });
    portfolio.dispatch('show-alert', { alert: NotebooksPopup.new({ type: 'Note', items: notes }) });
}
export function save() {
    let loaded = portfolio.get('loadedData');
    Globals.saveData(loaded);
    Globals.showActionAlert('Saved!', Globals.ColorScheme.green);

    loadOnline();
}
export function print() {
    window.print();
};
export function undo() {
    document.execCommand('undo');
};
export function redo() {
    document.execCommand('redo');
};
export function cut() {
    document.execCommand('cut');
};
export function copy() {
    document.execCommand('copy');
};
export function paste() {
    document.execCommand('paste');
};
export function selectAll() {
    document.execCommand('selectAll');
};
export function bold() {
    document.execCommand('bold');
};
export function italic() {
    document.execCommand('italic');
};
export function underline() {
    document.execCommand('underline');
};
export function highlight() {
    document.execCommand('useCSS', false, false);
    document.execCommand('hiliteColor', false, 'yellow');
};
export function subscript() {
    document.execCommand('subscript');
};
export function superscript() {
    document.execCommand('superscript');
};
export function codeSegment() {
    const code = `<pre class='code-segment'><code>var x = 5;</code></pre>`;
    document.execCommand('insertHTML', false, `<br>${code}<br>`);
};
export function bulletedList() {
    document.execCommand('insertUnorderedList');
};
export function numberedList() {
    document.execCommand('insertOrderedList');
};
export function checkbox() {
    document.execCommand('insertHTML', false, '<p><input class="checkbox" type="checkbox"><label>Checkbox Item</label></p><br/>');
    
    const checks = document.getElementsByClassName('checkbox');
    for(var i = 0; i < checks.length; i++) {
        const item = checks[i];
        
        item.onchange = () => {
            item.setAttribute('checked', item.checked);
        }
    }
};
export function image() {
    /* Figure out how to do this on mobile. */
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
};
export function showAccount() {
    portfolio.dispatch('show-alert', { alert: AccountPopup.new() });
};
export function saveOnline() {
    save();
};
export function loadOnline() {
    Globals.loadData(loaded => {
        portfolio.dispatch('load-data', { loadedData: loaded });
        Globals.showActionAlert('Successfully loaded all of your notebooks and notes from the database!', Globals.ColorScheme.green);
    });
};
export function backup() {
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
            fs.writeFileSync(fileName, JSON.stringify(portfolio.get('loadedData')), 'utf8');

            Globals.showActionAlert('Exported all notebooks and notes to backup file!', Globals.ColorScheme.green);
        });
    });
};
export function retreiveBackups() {
    const { dialog } = require('electron').remote;
    dialog.showOpenDialog(null, {
        properties: ['openFile'],
        filters: [{name: 'nbackup', extensions: ['nbackup']}]
    }, (paths) => {
        if(!paths) return;
        if(paths.length === 0) return;

        const data = JSON.parse(fs.readFileSync(paths[0], 'utf8'));
        portfolio.dispatch('load-data', { loadedData: data });

        Globals.showActionAlert('Successfully loaded all notebooks and notes from backup!', Globals.ColorScheme.green);
    });
};
export function switchContexts() {
    portfolio.dispatch('switch-context');
};

module.exports = work;