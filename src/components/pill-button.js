const Mosaic = require('@authman2/mosaic').default;

module.exports = new Mosaic({
    view: data => html`<button class='pill-button' onclick='${data.click}'>${ data.title }</button>`
});