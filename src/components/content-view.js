import Mosaic from 'mosaic-framework';

import Portfolio from '../util/Portfolio';


export default new Mosaic({
    name: 'content-view',
    portfolio: Portfolio,
    view() {
        const note = this.portfolio.get('currentNote');

        return html`
        <p id='created-field'>${(note && note.created && `Created: ${new Date(note.created).toDateString()}`) || ""}</p>
        <p id='modified-field'>${(note && note.modified && `Modified: ${new Date(note.modified).toDateString()}`) || ""}</p>

        <div id='title-field' contenteditable="true">Title</div>
        <div id='note-field' contenteditable="true">Start typing here</div>
        `
    }
})