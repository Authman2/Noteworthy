import Mosaic from 'mosaic-framework';

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
        Globals.slideOutCard('.notebook-cell', () => {
            portfolio.dispatch('go-to-notes', {
                notebook: this.data.notebook
            });
        })
    },
    deleteNotebook() {
        const { title } = this.data.notebook;
        Globals.showDeleteAlert(`Deleting "${title}"`, `Are you sure you want to delete
        the notebook "${title}"? This will also delete all of the notes inside of this notebook.`,
        this.data.notebook, 0);

        const drawer = document.getElementsByTagName('app-drawer')[0];
        if(!drawer) return;

        drawer.style.transform = 'translateX(100%)';
    },
    view() {
        const { notebook } = this.data;
        let pages = 0;
        let date = '------';
        if(notebook && notebook.pages) {
            pages = notebook.pages.length;
        }
        if(notebook && notebook.created) {
            date = Globals.getDateFromArray(notebook.created).toDateString();
        }

        return html`<div class='notebook-cell' onclick='${this.selectNotebook}'>
            <h2>${this.data.notebook.title}</h2>
            <p><b>Pages:</b> ${pages}</p>
            <p><b>Created:</b> ${date}</p>

            <alert-button color='#8F3936' onclick='${this.deleteNotebook.bind(this)}'>DELETE</alert-button>
        </div>`
    }
})