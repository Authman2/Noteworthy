import Mosaic from 'mosaic-framework';

export default new Mosaic({
    name: 'content-view',
    view() {
        return html`
        <div id='title-field' contenteditable="true"></div>
        <div id='note-field' contenteditable="true"></div>
        `
    }
})