const remote = require('electron').remote;
const BW = remote.BrowserWindow;

const Mosaic = require('@authman2/mosaic').default;
const portfolio = require('../portfolio');

const ContextItem = new Mosaic({
    view: data => html`<button class='context-item' onclick='${data.click}'><span class='${data.icon}'></span></button>`
})

const ViewContext = new Mosaic({
    portfolio,
    actions: {
        handleNew() { BW.getFocusedWindow().emit('new'); },
        handleShare() { BW.getFocusedWindow().emit('share'); },
        handleNotebooks() { BW.getFocusedWindow().emit('open-notebooks'); },
        handleNotes() { BW.getFocusedWindow().emit('open-notes'); },
    },
    view: function() {
        return html`<div style='display:inline-block;'>
            ${ ContextItem.new({ icon: 'fa fa-plus', click: this.actions.handleNew.bind(this) }) }
            ${ ContextItem.new({ icon: 'fa fa-envelope', click: this.actions.handleShare.bind(this) }) }
            ${ ContextItem.new({ icon: 'fa fa-book-open', click: this.actions.handleNotebooks.bind(this) }) }
            ${ ContextItem.new({ icon: 'fa fa-bars', click: this.actions.handleNotes.bind(this) }) }
        </div>`
    }
});
const SelectionContext = new Mosaic({
    actions: {
        handleBold() { BW.getFocusedWindow().emit('bold'); },
        handleItalic() { BW.getFocusedWindow().emit('italic'); },
        handleUnderline() { BW.getFocusedWindow().emit('underline'); },
        handleHighlighter() { BW.getFocusedWindow().emit('highlight'); },
        handleSubscript() { BW.getFocusedWindow().emit('subscript'); },
        handleSuperscript() { BW.getFocusedWindow().emit('superscript'); },
    },
    view: function() {
        return html`<div style='display:inline-block;'>
            ${ ViewContext.new() }
            ${ ContextItem.new({ icon: 'fa fa-bold', click: this.actions.handleBold.bind(this) }) }
            ${ ContextItem.new({ icon: 'fa fa-italic', click: this.actions.handleItalic.bind(this) }) }
            ${ ContextItem.new({ icon: 'fa fa-underline', click: this.actions.handleUnderline.bind(this) }) }
            ${ ContextItem.new({ icon: 'fa fa-highlighter', click: this.actions.handleHighlighter.bind(this) }) }
            ${ ContextItem.new({ icon: 'fa fa-subscript', click: this.actions.handleSubscript.bind(this) }) }
            ${ ContextItem.new({ icon: 'fa fa-superscript', click: this.actions.handleSuperscript.bind(this) }) }
        </div>`
    }
});
const InsertionContext = new Mosaic({
    actions: {
        handleCode() { BW.getFocusedWindow().emit('code-segment'); },
        handleListUl() { BW.getFocusedWindow().emit('bulleted-list'); },
        handleListOl() { BW.getFocusedWindow().emit('numbered-list'); },
        handleCheckbox() { BW.getFocusedWindow().emit('checkbox'); },
    },
    view: function() {
        return html`<div style='display:inline-block;'>
            ${ ViewContext.new() }
            ${ ContextItem.new({ icon: 'fa fa-code', click: this.actions.handleCode.bind(this) }) }
            ${ ContextItem.new({ icon: 'fa fa-list-ul', click: this.actions.handleListUl.bind(this) }) }
            ${ ContextItem.new({ icon: 'fa fa-list-ol', click: this.actions.handleListOl.bind(this) }) }
            ${ ContextItem.new({ icon: 'fa fa-check-square', click: this.actions.handleCheckbox.bind(this) }) }
        </div>`
    }
});
const SettingsContext = new Mosaic({
    actions: {
        handleAccount() { BW.getFocusedWindow().emit('show-account'); },
        handleSave() { BW.getFocusedWindow().emit('save-online'); },
        handleLoad() { BW.getFocusedWindow().emit('load-online'); }
    },
    view: function() {
        return html`<div style='display:inline-block;'>
            ${ ViewContext.new() }
            ${ ContextItem.new({ icon: 'fa fa-user-circle', click: this.actions.handleAccount.bind(this) }) }
            ${ ContextItem.new({ icon: 'fa fa-cloud-download-alt', click: this.actions.handleSave.bind(this) }) }
            ${ ContextItem.new({ icon: 'fa fa-cloud-upload-alt', click: this.actions.handleLoad.bind(this) }) }
        </div>`
    }
});
module.exports = new Mosaic({
    portfolio,
    actions: {
        getCurrentContextMenu() {
            let ctx = this.portfolio.get('context');
            switch(ctx) {
                case 0: return ViewContext.new();
                case 1: return SelectionContext.new();
                case 2: return InsertionContext.new();
                case 3: return SettingsContext.new();
                default: return ViewContext.new();
            }
        }
    },
    view() {
        return html`<div class='context-menu'>${ this.actions.getCurrentContextMenu.call(this) }</div>`
    }
});