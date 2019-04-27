import Mosaic from '@authman2/mosaic';
import tippy from 'tippy.js';

import portfolio from '../portfolio';

// import remote from 'electron';

const ContextItem = new Mosaic({
    view: self => html`<button class='context-item' onclick='${self.data.click}'
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
    delayTemplate: true,
    actions: {
        handleNew() {

        },
        handleShare() {

        },
        handleNotebooks() {

        },
        handleNotes() {

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

        },
        handleItalic() {

        },
        handleUnderline() {

        },
        handleHighlighter() {

        },
        handleSubscript() {

        },
        handleSuperscript() {

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

        },
        handleListUl() {

        },
        handleListOl() {

        },
        handleCheckbox() {

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

        },
        handleSave() {

        },
        handleLoad() {

        }
    },
    view: function() {
        return html`<div style='display:inline-block;'>
            ${ ViewContext.new() }
            ${ ContextItem.new({ title: 'Account', icon: 'fa fa-user-circle', click: this.actions.handleAccount.bind(this) }) }
            ${ ContextItem.new({ title: 'Save', icon: 'fa fa-cloud-download-alt', click: this.actions.handleSave.bind(this) }) }
            ${ ContextItem.new({ title: 'Load', icon: 'fa fa-cloud-upload-alt', click: this.actions.handleLoad.bind(this) }) }
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
            portfolio.dispatch('switch-context');
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