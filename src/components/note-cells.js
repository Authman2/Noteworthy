import Mosaic from '@authman2/mosaic';

import Globals from '../util/Globals';
import { portfolio } from "../portfolio";

export const NotebookCell = new Mosaic({
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

export const NoteCell = new Mosaic({
    delayTemplate: true,
    actions: {
        move() {
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