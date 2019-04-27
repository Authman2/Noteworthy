import Mosaic from '@authman2/mosaic';

export default new Mosaic({
    view: self => html`<button class='pill-button' onclick='${self.data.click}'>${ self.data.title }</button>`
});