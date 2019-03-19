const Mosaic = require('@authman2/mosaic').default;
const portfolio = require('../portfolio');

const ContextItem = new Mosaic({
    view: data => html`<button class='context-item' onclick='${data.click}'><span class='${data.icon}'></span></button>`
})

// Create the additional context items.
const selection = () => html`${ ContextItem.new({ icon: 'fa fa-bold', click: this.actions.handleNotes.bind(this) }) }
    ${ ContextItem.new({ icon: 'fa fa-italic', click: this.actions.handleNotes.bind(this) }) }
    ${ ContextItem.new({ icon: 'fa fa-underline', click: this.actions.handleNotes.bind(this) }) }
    ${ ContextItem.new({ icon: 'fa fa-highlight', click: this.actions.handleNotes.bind(this) }) }
    ${ ContextItem.new({ icon: 'fa fa-subscript', click: this.actions.handleNotes.bind(this) }) }
    ${ ContextItem.new({ icon: 'fa fa-superscript', click: this.actions.handleNotes.bind(this) }) }`;
const insertion = () => html`${ ContextItem.new({ icon: 'fa fa-code', click: this.actions.handleNotes.bind(this) }) }
    ${ ContextItem.new({ icon: 'fa fa-list-ul', click: this.actions.handleNotes.bind(this) }) }
    ${ ContextItem.new({ icon: 'fa fa-list-ol', click: this.actions.handleNotes.bind(this) }) }
    ${ ContextItem.new({ icon: 'fa fa-check-square', click: this.actions.handleNotes.bind(this) }) }
    ${ ContextItem.new({ icon: 'fa fa-image', click: this.actions.handleNotes.bind(this) }) }`;
const settings = () => html`${ ContextItem.new({ icon: 'fa fa-user-circle', click: this.actions.handleNotes.bind(this) }) }
    ${ ContextItem.new({ icon: 'fa fa-cloud-download-alt', click: this.actions.handleNotes.bind(this) }) }
    ${ ContextItem.new({ icon: 'fa fa-cloud-upload-alt', click: this.actions.handleNotes.bind(this) }) }`;

module.exports = new Mosaic({
    portfolio,
    actions: {
        getContextItems(from) {
            switch(from) {
                case 0: return '';
                case 1: return selection.call(this);
                case 2: return insertion.call(this);
                case 3: return settings.call(this);
                default: return '';
            }
        },
        handleNew() {
            // Move this later.
            this.portfolio.dispatch('switch-context');
        },
        handleShare() {

        },
        handleNotebooks() {

        },
        handleNotes() {

        }
    },
    view: function() {
        let context = this.portfolio.get('context');
        return html`<div class='context-menu'>
            ${ ContextItem.new({ icon: 'fa fa-plus', click: this.actions.handleNew.bind(this) }) }
            ${ ContextItem.new({ icon: 'fa fa-file-upload', click: this.actions.handleShare.bind(this) }) }
            ${ ContextItem.new({ icon: 'fa fa-book-open', click: this.actions.handleNotebooks.bind(this) }) }
            ${ ContextItem.new({ icon: 'fa fa-bars', click: this.actions.handleNotes.bind(this) }) }
            
            ${ this.actions.getContextItems(context) }
        </div>`
    }
});