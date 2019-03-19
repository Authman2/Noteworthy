const Mosaic = require('@authman2/mosaic').default;
const portfolio = require('../portfolio');

const ContextItem = new Mosaic({
    view: data => html`<button class='context-item' onclick='${data.click}'><span class='${data.icon}'></span></button>`
})

const ViewContext = new Mosaic({
    portfolio,
    actions: {
        handleNew() {
            this.portfolio.dispatch('switch-context');
        }
    },
    view: function() {
        return html`<div style='display:inline-block;'>
            ${ ContextItem.new({ icon: 'fa fa-plus', click: this.actions.handleNew.bind(this) }) }
            ${ ContextItem.new({ icon: 'fa fa-file-upload', click:() => {} }) }
            ${ ContextItem.new({ icon: 'fa fa-book-open', click: () => {}}) }
            ${ ContextItem.new({ icon: 'fa fa-bars', click: () => {} }) }
        </div>`
    }
});
const SelectionContext = new Mosaic({
    view: function() {
        return html`<div style='display:inline-block;'>
            ${ ViewContext.new() }
            ${ ContextItem.new({ icon: 'fa fa-bold', click: () => {} }) }
            ${ ContextItem.new({ icon: 'fa fa-italic', click: () => {} }) }
            ${ ContextItem.new({ icon: 'fa fa-underline', click: () => {} }) }
            ${ ContextItem.new({ icon: 'fa fa-highlighter', click: () => {} }) }
            ${ ContextItem.new({ icon: 'fa fa-subscript', click: () => {} }) }
            ${ ContextItem.new({ icon: 'fa fa-superscript', click: () => {} }) }
        </div>`
    }
});
const InsertionContext = new Mosaic({
    view: function() {
        return html`<div style='display:inline-block;'>
            ${ ViewContext.new() }
            ${ ContextItem.new({ icon: 'fa fa-code', click: () => {} }) }
            ${ ContextItem.new({ icon: 'fa fa-list-ul', click: () => {} }) }
            ${ ContextItem.new({ icon: 'fa fa-list-ol', click: () => {} }) }
            ${ ContextItem.new({ icon: 'fa fa-check-square', click: () => {} }) }
            ${ ContextItem.new({ icon: 'fa fa-image', click: () => {} }) }
        </div>`
    }
});
const SettingsContext = new Mosaic({
    view: function() {
        return html`<div style='display:inline-block;'>
            ${ ViewContext.new() }
            ${ ContextItem.new({ icon: 'fa fa-user-circle', click: () => {} }) }
            ${ ContextItem.new({ icon: 'fa fa-cloud-download-alt', click: () => {} }) }
            ${ ContextItem.new({ icon: 'fa fa-cloud-upload-alt', click: () => {} }) }
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
    view: function() {
        return html`<div class='context-menu-holder'>
            <div class='context-menu'>${ this.actions.getCurrentContextMenu.call(this) }</div>
        </div>`
    }
});