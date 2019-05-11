import $ from 'jquery';
import highlight from 'highlight.js';
import 'highlight.js/styles/vs2015.css';

import Global from './Globals';
import Networking from './Networking';
import { portfolio } from '../portfolio';

let electron;
let remote;
let setup;
if(window.require) {
    electron = window.require('electron');
    remote = electron.remote;

    setup = function() {
        remote.BrowserWindow.getFocusedWindow().on('new', event => {
            portfolio.dispatch('show-new-alert');
        });
        remote.BrowserWindow.getFocusedWindow().on('save', async event => {
            const noteID = portfolio.get('currentNote').id;
            const title = document.getElementById('work-title-field').innerText;
            const content = document.getElementById('work-content-field').innerHTML;
            
            const result = await Networking.save(noteID, title, content);
            if(result.ok) Global.showActionAlert(`Saved!`, Global.ColorScheme.green);
            else Global.showActionAlert(`${result.err}!`, Global.ColorScheme.red);
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
            $('.code-segment').each((_, element) => {
                highlight.highlightBlock(element);
            });
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
            portfolio.dispatch('show-account-alert');
        });
        remote.BrowserWindow.getFocusedWindow().on('backup', event => {
            
        });
        remote.BrowserWindow.getFocusedWindow().on('retrieve-backups', event => {
            
        });
        remote.BrowserWindow.getFocusedWindow().on('switch-context', event => {
            portfolio.dispatch('switch-context');
        });
    }
} else {
    setup = function() {};
}

export default setup;