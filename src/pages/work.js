const Mosaic = require('@authman2/mosaic').default;
const ContextMenu = require('../components/context-menu');

module.exports = new Mosaic({
    view: () => html`<div>
        ${ ContextMenu.new() }

        <div id='work-title-field' contenteditable='true'>Title</div>
        <div id='work-content-field' contenteditable='true'>Note</div>
    </div>`
});