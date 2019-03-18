const Mosaic = require('@authman2/mosaic').default;

module.exports = new Mosaic({
    view: () => html`<div>
        <h1>This is the work page</h1>
    </div>`
});