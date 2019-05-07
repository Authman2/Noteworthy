import Mosaic from '@authman2/mosaic';

import Globals from '../util/Globals';
import { portfolio } from '../portfolio';
import Networking from '../util/Networking';

const NotebookCell = new Mosaic({
    delayTemplate: true,
    actions: {
        delete() {
            // Make sure there is still a current user.
            const user = localStorage.getItem('noteworthy-current-user');
            if(!user) return Globals.showActionAlert('No user is currently logged in.', Globals.ColorScheme.red);

            // Close this alert and tell the portfolio to open up the Move alert.
            portfolio.dispatch(['close-alert', 'show-delete-alert'], {
                type: 0,
                title: this.data.notebook.title,
                id: this.data.notebook.id,
                message: `Are you sure you want to delete the notebook "${this.data.notebook.title}"? This
                    will also remove all of the notes inside of this notebook.`
            });
        }
    },
    view() {
        return html`<div class='notebook-cell'>
            <h2>Title: ${this.data.notebook.title}</h2>
            <h5>Notes: ${this.data.notebook.pages ? this.data.notebook.pages.length : 0}</h5>

            <button class='popup-btn' onclick="${this.data.selectNotebook}">Open</button>
            <button class='popup-btn' onclick="${this.actions.delete}">Delete</button>
            <hr class='cell-separator'/>
        </div>`
    }
});

const NoteCell = new Mosaic({
    delayTemplate: true,
    actions: {
        async move() {
            // Make sure there is still a current user.
            const user = localStorage.getItem('noteworthy-current-user');
            if(!user) return Globals.showActionAlert('No user is currently logged in.', Globals.ColorScheme.red);

            // Load up all of the notebooks that this user has.
            const notebooks = portfolio.get('notebooks');

            // Close this alert and tell the portfolio to open up the Move alert.
            const cnb = portfolio.get('currentNotebook');
            portfolio.dispatch(['close-alert', 'show-move-alert'], {
                notebooks,
                title: this.data.note.title,
                currentNotebook: cnb,
                movingNote: this.data.note
            });
        },
        delete() {
            // Make sure there is still a current user.
            const user = localStorage.getItem('noteworthy-current-user');
            if(!user) return Globals.showActionAlert('No user is currently logged in.', Globals.ColorScheme.red);

            // Close this alert and tell the portfolio to open up the Move alert.
            portfolio.dispatch(['close-alert', 'show-delete-alert'], {
                type: 1,
                title: this.data.note.title,
                id: this.data.note.id,
                message: `Are you sure you want to delete the note "${this.data.note.title}"? This cannot be undone.`
            });
        }
    },
    view() {
        const date = new Date(this.data.note.created);
        return html`<div class='notebook-cell'>
            <h2>${this.data.note.title}</h2>
            <h4>Created: ${date.toDateString()}</h4>
            <button class='popup-btn' onclick="${this.data.selectNote}">Open</button>
            <button class='popup-btn' onclick="${this.actions.move}">Move</button>
            <button class='popup-btn' onclick="${this.actions.delete}">Delete</button>
            <hr class='cell-separator'/>
        </div>`
    }
});

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

            this.actions.close.call(this);
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