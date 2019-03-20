const remote = require('electron').remote;
const BW = remote.BrowserWindow;
const $ = require('jquery');

const Mosaic = require('@authman2/mosaic').default;
const ContextMenu = require('../components/context-menu');
const NewPopup = require('../popups/new');
const SharePopup = require('../popups/share');
const NotebooksPopup = require('../popups/notebooks');

const Globals = require('../other/Globals');
const portfolio = require('../portfolio');

const work = new Mosaic({
    portfolio,
    view: function() {
        return html`<div class='work'>
            ${ ContextMenu.new() }
            ${ this.portfolio.get('alert') }

            <div id='work-title-field' contenteditable='true'>Title</div>
            <div id='work-content-field' contenteditable='true'>Note</div>
        </div>`
    },
    created() {
        Globals.loadData(loaded => {
            portfolio.dispatch('load-data', { loadedData: loaded });
        });
    }
});
module.exports = work;


BW.getFocusedWindow().on('new', (event, command) => {
    portfolio.dispatch('show-alert', { alert: NewPopup.new() });
});
BW.getFocusedWindow().on('share', (event, command) => {
    portfolio.dispatch('show-alert', { alert: SharePopup.new() });
});
BW.getFocusedWindow().on('open-notebooks', (event, command) => {
    let notebooks = Object.values(portfolio.get('loadedData')).filter(item => {
        return item.pages;
    });
    portfolio.dispatch('show-alert', { alert: NotebooksPopup.new({ type: 'Notebook', items: notebooks }) });
});
BW.getFocusedWindow().on('open-notes', (event, command) => {
    let cnb = portfolio.get('currentNotebook');
    if(!cnb) {
        Globals.showActionAlert('You must select a notebook first before you open any notes', Globals.ColorScheme.red);
        return;
    }

    let notes = Object.values(portfolio.get('loadedData')).filter(item => {
        return !item.pages && item.notebook === cnb.id;
    });
    portfolio.dispatch('show-alert', { alert: NotebooksPopup.new({ type: 'Note', items: notes }) });
});
BW.getFocusedWindow().on('save', (event, command) => {
    Globals.saveData(portfolio.get('loadedData'));
    Globals.showActionAlert('Saved!', Globals.ColorScheme.green);

    BW.getFocusedWindow().emit('load');
});
BW.getFocusedWindow().on('load', (event, command) => {
    Globals.loadData(loaded => {
        portfolio.dispatch('load-data', { loadedData: loaded });
    });
});
BW.getFocusedWindow().on('print', (event, command) => {
    window.print();
});
BW.getFocusedWindow().on('undo', (event, command) => {
    document.execCommand('undo');
});
BW.getFocusedWindow().on('redo', (event, command) => {
    document.execCommand('redo');
});
BW.getFocusedWindow().on('cut', (event, command) => {
    document.execCommand('cut');
});
BW.getFocusedWindow().on('copy', (event, command) => {
    document.execCommand('copy');
});
BW.getFocusedWindow().on('paste', (event, command) => {
    document.execCommand('paste');
});
BW.getFocusedWindow().on('select-all', (event, command) => {
    document.execCommand('selectAll');
});
BW.getFocusedWindow().on('bold', (event, command) => {
    document.execCommand('bold');
});
BW.getFocusedWindow().on('italic', (event, command) => {
    document.execCommand('italic');
});
BW.getFocusedWindow().on('underline', (event, command) => {
    document.execCommand('underline');
});
BW.getFocusedWindow().on('highlight', (event, command) => {
    document.execCommand('useCSS', false, false);
    document.execCommand('hiliteColor', false, 'yellow');
});
BW.getFocusedWindow().on('subscript', (event, command) => {
    document.execCommand('subscript');
});
BW.getFocusedWindow().on('superscript', (event, command) => {
    document.execCommand('superscript');
});
BW.getFocusedWindow().on('code-segment', (event, command) => {
    const code = `<pre class='code-segment'><code>var x = 5;</code></pre>`;
    document.execCommand('insertHTML', false, `<br>${code}<br>`);
});
BW.getFocusedWindow().on('bulleted-list', (event, command) => {
    document.execCommand('insertUnorderedList');
});
BW.getFocusedWindow().on('numbered-list', (event, command) => {
    document.execCommand('insertOrderedList');
});
BW.getFocusedWindow().on('checkbox', (event, command) => {
    document.execCommand('insertHTML', false, '<p><input class="checkbox" type="checkbox"><label>Checkbox Item</label></p><br/>');
    
    const checks = document.getElementsByClassName('checkbox');
    for(var i = 0; i < checks.length; i++) {
        const item = checks[i];
        
        item.onchange = () => {
            item.setAttribute('checked', item.checked);
        }
    }
});
BW.getFocusedWindow().on('image', (event, command) => {
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
});
BW.getFocusedWindow().on('show-account', (event, command) => {
    
});
BW.getFocusedWindow().on('save-online', (event, command) => {
    BW.getFocusedWindow().emit('save');
});
BW.getFocusedWindow().on('load-online', (event, command) => {
    BW.getFocusedWindow().emit('load');
});
BW.getFocusedWindow().on('backup', (event, command) => {
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
});
BW.getFocusedWindow().on('retrieve-backups', (event, command) => {
    dialog.showOpenDialog(null, {
        properties: ['openFile'],
        filters: [{name: 'nbackup', extensions: ['nbackup']}]
    }, (paths) => {
        if(!paths) return;
        if(paths.length === 0) return;

        const data = JSON.parse(fs.readFileSync(paths[0], 'utf8'));
        portfolio.dispatch('load-data', data);

        Globals.showActionAlert('Successfully loaded all notebooks and notes from backup!', Globals.ColorScheme.green);
    });
});
BW.getFocusedWindow().on('switch-context', (event, command) => {
    portfolio.dispatch('switch-context');
});