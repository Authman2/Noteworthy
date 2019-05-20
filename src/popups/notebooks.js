import Mosaic from '@authman2/mosaic';

import Globals from '../util/Globals';
import { portfolio } from '../portfolio';

import { NoteCell, NotebookCell } from "../components/note-cells";


export default new Mosaic({
    portfolio,
    delayTemplate: true,
    data: {
        type: 'Notebook',
        items: []
    },
    actions: {
        close() {
            portfolio.dispatch('close-alert');
        },
        selectNotebook(item) {
            if(this.data.type === 'Note') {
                portfolio.dispatch('select-note', { note: item });
                document.getElementById('work-title-field').innerHTML = item.title;
                document.getElementById('work-content-field').innerHTML = item.content;
            } else {
                portfolio.dispatch('select-notebook', { notebook: item });
            }

            portfolio.dispatch('close-alert');
            Globals.showActionAlert(`Opened the ${this.data.type.toLowerCase()} <b>${item.title}</b>`, Globals.ColorScheme.blue);
        }
    },
    view() {
        return html`<div class='popup-backdrop'>
            <div class='popup'>
                <button class='close-btn' onclick='${this.actions.close}'><span class='fa fa-times'></span></button>

                <h1 class='popup-title'>${
                    this.data.type === 'Notebook' ? 'My Notebooks' : portfolio.get('currentNotebook').title
                }</h1>
                <h4 class='popup-subtitle'>Select a ${this.data.type.toLowerCase()} to open:</h4>

                <div class='notebooks-view'>
                    ${
                        this.data.items.length > 0 ? this.data.items.map((item, index) => {
                            if(this.data.type === 'Notebook') {
                                return NotebookCell.new({ notebook: item, selectNotebook: this.actions.selectNotebook.bind(this, item) });
                            } else {
                                return NoteCell.new({ note: item, selectNote: this.actions.selectNotebook.bind(this, item) })
                            }
                        }) : ''
                    }
                </div>
            </div>
        </div>`
    }
});