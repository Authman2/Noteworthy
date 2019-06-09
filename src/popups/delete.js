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
    async delete() {
        Globals.showActionAlert(`Deleting <b>"${this.data.title}"</b>...`);

        if(this.data.type === 0) {
            const result = await Networking.deleteNotebook(this.data.id);
            if(result.ok === true) {
                portfolio.dispatch('close-alert');
                Globals.showActionAlert(`Deleted the notebook <b>"${this.data.title}"</b> and all of its notes`);
            } else {
                portfolio.dispatch('close-alert');
                Globals.showActionAlert(`There was a problem delete the notebook <br>${this.data.title}</b>`, Globals.ColorScheme.red);
            }
        } else {
            const result = await Networking.deleteNote(this.data.id);
            if(result.ok === true) {
                portfolio.dispatch('close-alert');
                Globals.showActionAlert(`Deleted the note <b>"${this.data.title}"</b>`);
            } else {
                portfolio.dispatch('close-alert');
                Globals.showActionAlert(`There was a problem delete the note <b>${this.data.title}</b>`, Globals.ColorScheme.red);
            }
        }
    },
    view: self => html`<div class='popup-backdrop'>
        <div class='popup delete-popup'>
            <button class='close-btn' onclick='${self.close}'><span class='fa fa-times'></span></button>

            <h1 class='popup-title'>Deleting "${self.data.title}"</h1>
            <h4 class='popup-subtitle'>${self.data.message}</h4>

            <div class="buttons-area">
                <button class='hollow-btn' onclick="${self.close}">No, cancel</button>
                <button class='rect-btn' onclick="${self.delete}">Yes, delete now</button>
            </div>
        </div>
    </div>`
});