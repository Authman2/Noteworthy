import highlight from 'highlight.js';
import 'highlight.js/styles/vs2015.css';

import Global from './Globals';
import Networking from './Networking';
import { portfolio } from '../portfolio';

let electron;
let remote;
let dialog;
let setup;
if(window.require) {
    electron = window.require('electron');
    remote = electron.remote;
    dialog = remote.dialog;

    setup = function(router) {
        remote.BrowserWindow.getFocusedWindow().on('new', event => {
            portfolio.dispatch('show-new-alert');
        });
        remote.BrowserWindow.getFocusedWindow().on('save', async event => {
            if(!portfolio.get('currentNote'))
                return Global.showActionAlert('You must open a note to save!', Global.ColorScheme.red);
            
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
        });
        remote.BrowserWindow.getFocusedWindow().on('print', event => {
            window.print();
        });
        remote.BrowserWindow.getFocusedWindow().on('share', event => {
            portfolio.dispatch('show-share-alert');
        });
        remote.BrowserWindow.getFocusedWindow().on('undo', event => {
            document.execCommand('undo');
        });
        remote.BrowserWindow.getFocusedWindow().on('redo', event => {
            document.execCommand('redo');
        });
        remote.BrowserWindow.getFocusedWindow().on('cut', event => {
            document.execCommand('cut');
        });
        remote.BrowserWindow.getFocusedWindow().on('copy', event => {
            document.execCommand('copy');
        });
        remote.BrowserWindow.getFocusedWindow().on('paste', event => {
            document.execCommand('paste');
        });
        remote.BrowserWindow.getFocusedWindow().on('select-all', event => {
            document.execCommand('selectAll');
        });
        remote.BrowserWindow.getFocusedWindow().on('bold', event => {
            document.execCommand('bold');
        });
        remote.BrowserWindow.getFocusedWindow().on('italic', event => {
            document.execCommand('italic');
        });
        remote.BrowserWindow.getFocusedWindow().on('underline', event => {
            document.execCommand('underline');
        });
        remote.BrowserWindow.getFocusedWindow().on('highlight', event => {
            document.execCommand('useCSS', false, false);
            document.execCommand('hiliteColor', false, 'yellow');
        });
        remote.BrowserWindow.getFocusedWindow().on('subscript', event => {
            document.execCommand('subscript');
        });
        remote.BrowserWindow.getFocusedWindow().on('superscript', event => {
            document.execCommand('superscript');
        });
        remote.BrowserWindow.getFocusedWindow().on('code-segment', event => {
            const code = `<pre class='code-segment'><code>var x = 5;</code><br><br></pre>`;
            document.execCommand('insertHTML', false, `<br>${code}<br>`);
        });
        remote.BrowserWindow.getFocusedWindow().on('highlight', event => {
            for(const element of document.getElementsByClassName('code-segment')) {
                highlight.highlightBlock(element);
            }
        });
        remote.BrowserWindow.getFocusedWindow().on('bulleted-list', event => {
            document.execCommand('insertUnorderedList');
        });
        remote.BrowserWindow.getFocusedWindow().on('numbered-list', event => {
            document.execCommand('insertOrderedList');
        });
        remote.BrowserWindow.getFocusedWindow().on('checkbox', event => {
            document.execCommand('insertHTML', false, '<p><input class="checkbox" type="checkbox"><label>Checkbox Item</label></p><br/>');
        
            const checks = document.getElementsByClassName('checkbox');
            for(var i = 0; i < checks.length; i++) {
                const item = checks[i];
                
                item.onchange = () => {
                    item.setAttribute('checked', item.checked);
                }
            }
        });
        remote.BrowserWindow.getFocusedWindow().on('show-account', event => {
            portfolio.dispatch('show-account-alert', {
                router: router
            });
        });
        remote.BrowserWindow.getFocusedWindow().on('backup', async event => {
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
                    const saving = JSON.stringify(backup);
                    fs.writeFile(filename, saving, _ => {
                        Global.showActionAlert(`Exported to ${filename}!`, Global.ColorScheme.blue);
                    });
                });
            }
        });
        remote.BrowserWindow.getFocusedWindow().on('retrieve-backups', async event => {
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
        });
        remote.BrowserWindow.getFocusedWindow().on('switch-context', event => {
            portfolio.dispatch('switch-context');
        });
    }
} else {
    setup = function() {};
}

export default setup;