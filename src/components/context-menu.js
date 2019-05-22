import Mosaic from '@authman2/mosaic';
let electron;
let remote;
let dialog;
let fs;
if(window.require) {
    fs = window.require('fs');
    electron = window.require('electron');
    remote = electron.remote;
    dialog = remote.dialog;
}

import Global from '../util/Globals';
import { portfolio } from '../portfolio';
import Networking from '../util/Networking';

import ContextItem from './context-item';


const ViewContext = new Mosaic({
    portfolio,
    delayTemplate: true,
    actions: {
        handleNew() {
            this.portfolio.dispatch('show-new-alert');
        },
        handleShare() {
            if(!portfolio.get('currentNote')) {
                Global.showActionAlert('You must select a note before you can share one!', Global.ColorScheme.red);
                return;
            }

            this.portfolio.dispatch('show-share-alert');
        },
        async handleNotebooks() {
            const resp = await Networking.loadNotebooks();
            if(resp.ok === true) {
                portfolio.dispatch(['load-notebooks', 'show-notebooks-alert'], {
                    type: 'Notebook',
                    notebooks: resp.notebooks,
                });
            } else {
                switch(resp.code) {
                    case 401:
                        Global.showRefreshUserAlert();
                        break;
                    default:
                        if(resp.err.includes('No current user')) Global.showRefreshUserAlert();
                        else Global.showActionAlert(resp.err, Global.ColorScheme.red);
                        break;
                }
            }
        },
        async handleNotes() {
            if(!portfolio.get('currentNotebook')) {
                Global.showActionAlert('You must select a notebook before opening notes', Global.ColorScheme.red);
                return;
            }

            // Load the current notebooks' notes.
            Global.showActionAlert('Loading notes...');
            const nid = portfolio.get('currentNotebook').id;
            const resp = await Networking.loadNotes(nid);
            this.portfolio.dispatch(['load-notes', 'show-notebooks-alert'], {
                notes: resp.notes.notes,
                type: 'Note'
            });
            Global.hideActionAlert();
        },
    },
    view: function() {
        return html`<div style='display:inline-block;'>
            ${ ContextItem.new({ title: 'New', icon: 'fa fa-plus', click: this.actions.handleNew.bind(this) }) }
            ${ ContextItem.new({ title: 'Share', icon: 'fa fa-envelope', click: this.actions.handleShare.bind(this) }) }
            ${ ContextItem.new({ title: 'Notebooks', icon: 'fa fa-book-open', click: this.actions.handleNotebooks.bind(this) }) }
            ${ ContextItem.new({ title: 'Notes', icon: 'fa fa-bars', click: this.actions.handleNotes.bind(this) }) }
        </div>`
    }
});
const SelectionContext = new Mosaic({
    delayTemplate: true,
    actions: {
        handleBold() {
            document.execCommand('bold');
        },
        handleItalic() {
            document.execCommand('italic');
        },
        handleUnderline() {
            document.execCommand('underline');
        },
        handleHighlighter() {
            document.execCommand('useCSS', false, false);
            document.execCommand('hiliteColor', false, 'yellow');
        },
        handleSubscript() {
            document.execCommand('subscript');
        },
        handleSuperscript() {
            document.execCommand('superscript');
        },
    },
    view: function() {
        return html`<div style='display:inline-block;'>
            ${ ViewContext.new() }
            ${ ContextItem.new({ title: 'Bold', icon: 'fa fa-bold', click: this.actions.handleBold.bind(this) }) }
            ${ ContextItem.new({ title: 'Italic', icon: 'fa fa-italic', click: this.actions.handleItalic.bind(this) }) }
            ${ ContextItem.new({ title: 'Underline', icon: 'fa fa-underline', click: this.actions.handleUnderline.bind(this) }) }
            ${ ContextItem.new({ title: 'Highlight', icon: 'fa fa-highlighter', click: this.actions.handleHighlighter.bind(this) }) }
            ${ ContextItem.new({ title: 'Subscript', icon: 'fa fa-subscript', click: this.actions.handleSubscript.bind(this) }) }
            ${ ContextItem.new({ title: 'Superscript', icon: 'fa fa-superscript', click: this.actions.handleSuperscript.bind(this) }) }
        </div>`
    }
});
const InsertionContext = new Mosaic({
    delayTemplate: true,
    actions: {
        handleCode() {
            const code = `<pre class='code-segment' onclick='this.focus()'><code>var x = 5;</code><br><br></pre>`;
            document.execCommand('insertHTML', false, `<br>${code}<br>`);
        },
        handleListUl() {
            document.execCommand('insertUnorderedList');
        },
        handleListOl() {
            document.execCommand('insertOrderedList');
        },
        handleCheckbox() {
            document.execCommand('insertHTML', false, '<p><input class="checkbox" type="checkbox"><label>Checkbox Item</label></p><br/>');
    
            const checks = document.getElementsByClassName('checkbox');
            for(var i = 0; i < checks.length; i++) {
                const item = checks[i];
                
                item.onchange = () => {
                    item.setAttribute('checked', item.checked);
                }
            }
        },
    },
    view: function() {
        return html`<div style='display:inline-block;'>
            ${ ViewContext.new() }
            ${ ContextItem.new({ title: 'Code', icon: 'fa fa-code', click: this.actions.handleCode.bind(this) }) }
            ${ ContextItem.new({ title: 'Bulleted List', icon: 'fa fa-list-ul', click: this.actions.handleListUl.bind(this) }) }
            ${ ContextItem.new({ title: 'Numbered List', icon: 'fa fa-list-ol', click: this.actions.handleListOl.bind(this) }) }
            ${ ContextItem.new({ title: 'Checkbox', icon: 'fa fa-check-square', click: this.actions.handleCheckbox.bind(this) }) }
        </div>`
    }
});
const SettingsContext = new Mosaic({
    delayTemplate: true,
    actions: {
        handleAccount() {
            portfolio.dispatch('show-account-alert', {
                router: this.data.router
            });
        },
        async handleSave() {
            if(!portfolio.get('currentNote'))
                return Global.showActionAlert('You must open a note to save!', Global.ColorScheme.red);
            Global.showActionAlert('Saving...');

            const noteID = portfolio.get('currentNote').id;
            const title = document.getElementById('work-title-field').innerText;
            const content = document.getElementById('work-content-field').innerHTML;

            const result = await Networking.save(noteID, title, content);
            if(result.ok) Global.showActionAlert(`Saved!`, Global.ColorScheme.green);
            else {
                switch(result.code) {
                    case 401:
                        Global.showRefreshUserAlert();
                        break;
                    default:
                        if(resp.err.includes('No current user')) Global.showRefreshUserAlert();
                        else Global.showActionAlert(result.err, Global.ColorScheme.red);
                        break;
                }
            }
        },
        async handleBackup() {
            if(window.require) {
                Global.showActionAlert('Backing up all note data...', Global.ColorScheme.gray, 4000);

                // Get the notebooks.
                let backup = {};
                let notebooks = portfolio.get('notebooks');
                if(notebooks.length === 0) {
                    const result = await Networking.loadNotebooks();
                    if(result.ok === true) notebooks = result.notebooks;
                    else {
                        switch(resp.code) {
                            case 401:
                                Global.showRefreshUserAlert();
                                break;
                            default:
                                if(resp.err.includes('No current user')) return Global.showRefreshUserAlert();
                                else return Global.showActionAlert('There was a problem trying to backup your notes.', Global.ColorScheme.red);
                        }
                    }
                }

                for(let notebook of notebooks) {
                    // Load all of the notes from this notebook.
                    const result = await Networking.loadNotes(notebook.id);
                    if(result.ok === true) {
                        result.notes.notes.forEach(async note => {
                            backup[note.id] = note;
                        });
                    }
                    backup[notebook.id] = notebook;
                };
                Global.hideActionAlert();
                
                // Save to a local directory on your computer.
                dialog.showSaveDialog(null, {
                    title: `NoteworthyBackup_${Date.now()}.txt`,
                    filters: [{name: 'txt', extensions: ['txt']}]
                }, async filename => {
                    if(!filename) return;

                    const saving = JSON.stringify(backup);
                    fs.writeFile(filename, saving, _ => {
                        Global.showActionAlert(`Exported to ${filename}!`, Global.ColorScheme.blue);
                    });
                });
            }
        },
        async handleRestore() {
            if(window.require) {
                dialog.showOpenDialog(null, {
                    openFile: true,
                }, files => {
                    if(!files) return;
                    const filename = files[0];
                    fs.readFile(filename, 'utf8', async (err, resp) => {
                        // Take each note and notebook from the restored filed
                        // and save them to the database.
                        const toJSON = JSON.parse(resp);
                        const result = await Networking.restore(toJSON);
                        if(result.ok === true) Global.showActionAlert('Restored notes from backup!', Global.ColorScheme.green);
                        else {
                            switch(result.code) {
                                case 401:
                                    Global.showRefreshUserAlert();
                                    break;
                                default:
                                    if(resp.err.includes('No current user')) Global.showRefreshUserAlert();
                                    else Global.showActionAlert('There was a problem restoring your notes. ' + result.err, Global.ColorScheme.red);
                                    break;
                            }
                        }
                    });
                });
            }
        }
    },
    view: function() {
        return html`<div style='display:inline-block;'>
            ${ ViewContext.new() }
            ${ ContextItem.new({ title: 'Account', icon: 'fa fa-user-circle', click: this.actions.handleAccount.bind(this) }) }
            ${ ContextItem.new({ title: 'Save', icon: 'fa fa-save', click: this.actions.handleSave.bind(this) }) }
            ${ ContextItem.new({ title: 'Backup', icon: 'fa fa-file-download', click: this.actions.handleBackup.bind(this) }) }
            ${ ContextItem.new({ title: 'Restore', icon: 'fa fa-file-upload', click: this.actions.handleRestore.bind(this) }) }
        </div>`
    }
});
export default new Mosaic({
    portfolio,
    actions: {
        toCM() {
            let ctx = this.portfolio.get('context');
            const router = this.data.router;
            switch(ctx) {
                case 0: return ViewContext.new({ router });
                case 1: return SelectionContext.new({ router });
                case 2: return InsertionContext.new({ router });
                case 3: return SettingsContext.new({ router });
                default: return ViewContext.new({ router });
            }
        },
        nextContext() {
            this.portfolio.dispatch('switch-context');
        }
    },
    view: self => html`<div class='context-menu'>
        ${ self.actions.toCM.call(self) }
        ${ ContextItem.new({
            title: 'Next',
            icon: 'fa fa-chevron-right',
            click: self.actions.nextContext.bind(self)
        }) }
    </div>`
});