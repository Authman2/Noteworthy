import Mosaic from '@authman2/mosaic';
import tippy from 'tippy.js';
import $ from 'jquery';
import highlight from 'highlight.js';
import 'highlightjs/styles/vs2015.css';

import Global from '../util/Globals';
import { portfolio } from '../portfolio';
import Networking from '../util/Networking';

// import remote from 'electron';

const ContextItem = new Mosaic({
    view: self => html`<button class='context-item' onclick='${self.data.click}' on-tap='${self.data.click}'
        data-tippy-content='${self.data.title || ""}'
        onmouseover="${self.actions.tooltip}"><span class='${self.data.icon}'></span></button>`,
    actions: {
        tooltip() {
            tippy('.context-item', {
                content: `${this.data.title}`,
                arrow: true,
                duration: [150, 150],
                distance: 15,
                placement: 'bottom',
                size: 'small'
            });
        }
    }
})

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
            portfolio.dispatch('load-notebooks', { notebooks: resp.notebooks });

            this.portfolio.dispatch('show-notebooks-alert', {
                type: 'Notebook'
            });
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
            portfolio.dispatch('show-account-alert');
        },
        async handleSave() {
            Global.showActionAlert('Saving...');

            const noteID = portfolio.get('currentNote').id;
            const title = document.getElementById('work-title-field').innerText;
            const content = document.getElementById('work-content-field').innerHTML;

            const result = await Networking.save(noteID, title, content);
            if(result.ok) Global.showActionAlert(`Saved!`, Global.ColorScheme.green);
            else Global.showActionAlert(`${result.err}!`, Global.ColorScheme.red);
        },
        async handleBackup() {
            
        },
        async handleRestore() {

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
            switch(ctx) {
                case 0: return ViewContext.new();
                case 1: return SelectionContext.new();
                case 2: return InsertionContext.new();
                case 3: return SettingsContext.new();
                default: return ViewContext.new();
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