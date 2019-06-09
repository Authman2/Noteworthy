import Mosaic from '@authman2/mosaic';

import Globals from '../util/Globals';
import { portfolio } from '../portfolio';
import Networking from '../util/Networking';

export default new Mosaic({
    portfolio,
    element: '#overlay',
    delayTemplate: true,
    data: { title: '', notebooks: [] },
    close() { portfolio.dispatch('close-alert'); },
    async moveTo(item) {
        // Make an API call to actual move the note between the two notebooks.
        const noteID = this.data.movingNote.id;
        const fromNotebook = portfolio.get('currentNotebook').id;
        const toNotebook = item.id;

        const result = await Networking.move(noteID, fromNotebook, toNotebook);
        if(result.ok === true) {
            portfolio.dispatch('close-alert');
            Globals.showActionAlert(`Moved the note <b>${this.data.title}</b> from 
            <b>${this.data.currentNotebook.title}</b> into the notebook <b>${item.title}</b>!`,
            Globals.ColorScheme.blue, 4000);
        } else {
            portfolio.dispatch('close-alert');
            Globals.showActionAlert(`There was a problem moving the note ${this.data.title}`, Globals.ColorScheme.red);
        }
    },
    view() {
        return html`<div class='popup-backdrop'>
            <div class='popup move-popup'>
                <button class='close-btn' onclick='${this.close}'><span class='fa fa-times'></span></button>

                <h1 class='popup-title'>Where would you like to move the note "${this.data.title}" to?</h1>
                <h4 class='popup-subtitle'>Select a notebook below:</h4>

                <div class='move-view'>
                    ${
                        this.data.notebooks.length > 0 ? this.data.notebooks.map((item, index) => {
                            if(this.data.currentNotebook && item.id === this.data.currentNotebook.id) return html`<span></span>`;
                            return html`<button class='rect-btn' onclick="${this.moveTo.bind(this, item)}">
                                ${ item.title }
                            </button>`
                        }) : ''
                    }
                </div>
            </div>
        </div>`
    }
});