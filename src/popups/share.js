import Mosaic from '@authman2/mosaic';
import turndown from 'turndown';
const fs = require('fs');
let electron;
let remote;
let dialog;
if(window.require) {
    electron = window.require('electron');
    remote = electron.remote;
    dialog = remote.dialog;
}

import Globals from '../util/Globals';
import { portfolio } from '../portfolio';

const tdService = new turndown();
tdService.addRule('', {
    filter: 'mark',
    replacement: function(content) {
        return `==${content}==`
    }
})
tdService.addRule('', {
    filter: 'u',
    replacement: function(content) {
        return `<u>${content}</u>`
    }
})
tdService.addRule('', {
    filter: 'strike',
    replacement: function(content) {
        return `~~${content}~~`
    }
})
tdService.addRule('', {
    filter: 'sub',
    replacement: function(content) {
        return `~${content}~`
    }
})
tdService.addRule('', {
    filter: 'sup',
    replacement: function(content) {
        return `^${content}^`
    }
})
tdService.addRule('', {
    filter: 'br',
    replacement: function(content) {
        return `<br>`;
    }
})
tdService.addRule('', {
    filter: 'span',
    replacement: function(content) {
        return `==${content}==`;
    }
})

export default new Mosaic({
    data: {
        title: "",
        content: ""
    },
    actions: {
        close() {
            portfolio.dispatch('close-alert');
        },
        txt() {
            if(window.require) {
                const toExport = this.data.content;
                dialog.showSaveDialog(null, {
                    title: `${this.data.title}.txt`,
                    filters: [{name: 'txt', extensions: ['txt']}]
                }, (filename) => {
                    fs.writeFileSync(filename, toExport, 'utf8');
                    portfolio.dispatch('close-alert');
                    Globals.showActionAlert(`Exported to ${filename}!`, Globals.ColorScheme.blue);
                });
            }
        },
        md() {
            if(window.require) {
                const _html = this.data.content.replace(/<input class="checkbox" type="checkbox">/g, '[ ] ')
                            .replace(/<input class="checkbox" id="checkbox[0-9]*" type="checkbox">/g, '[ ] ')
                            .replace(/<input class="checkbox" type="checkbox" checked="false">/g, '[ ] ')
                            .replace(/<input class="checkbox" type="checkbox" checked="true">/g, '[x] ');
                const md = tdService.turndown(_html);
                const toExport = md;
                dialog.showSaveDialog(null, {
                    title: `${this.data.title}.md`,
                    filters: [{name: 'md', extensions: ['md']}]
                }, (filename) => {
                    fs.writeFileSync(filename, toExport, 'utf8');
                    portfolio.dispatch('close-alert');
                    Globals.showActionAlert(`Exported to ${filename}!`, Globals.ColorScheme.blue);
                });
            }
        },
        html() {
            if(window.require) {
                const toExport = this.data.content;
                dialog.showSaveDialog(null, {
                    title: `${this.data.title}.html`,
                    filters: [{name: 'html', extensions: ['html']}]
                }, (filename) => {
                    fs.writeFileSync(filename, toExport, 'utf8');
                    portfolio.dispatch('close-alert');
                    Globals.showActionAlert(`Exported to ${filename}!`, Globals.ColorScheme.blue);
                });
            }
        }
    },
    view() {
        return html`<div class='popup-backdrop'>
            <div class='popup'>
                <button class='close-btn' onclick='${this.actions.close}'><span class='fa fa-times'></span></button>

                <h1 class='popup-title'>Share</h1>
                <h1 class='popup-subtitle'>Select the file type to export to:</h1>
                <button class='rect-btn' onclick='${this.actions.txt}'>TXT</button>
                <button class='rect-btn' onclick='${this.actions.md}'>Markdown</button>
                <button class='rect-btn' onclick='${this.actions.html}'>HTML</button>
                <br><br>
            </div>
        </div>`
    }
});