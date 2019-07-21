import Mosaic from '@authman2/mosaic';

import Globals from '../util/Globals';
import portfolio from '../portfolio';

import '../components/alert-button';

import '../styles/notebook-cell.less';


export default new Mosaic({
    name: 'notebook-cell',
    data: {
        notebook: {}
    },
    selectNotebook() {
        portfolio.dispatch('go-to-notes', {
            notebook: this.data.notebook
        });
    },
    view() {
        const pages = (this.data.notebook.pages && this.data.notebook.pages.length) || 0;
        const date = Globals.getDateFromArray((this.data.notebook.pages && this.data.notebook.pages.created) || []);

        return html`<div class='notebook-cell' onclick='${this.selectNotebook}'>
            <h2>${this.data.notebook.title}</h2>
            <p><b>Pages:</b> ${pages}</p>
            <p><b>Created:</b> ${date.toDateString()}</p>

            <alert-button color='#8F3936'>DELETE</alert-button>
        </div>`
    }
})