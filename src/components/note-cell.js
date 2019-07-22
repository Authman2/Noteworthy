import Mosaic from '@authman2/mosaic';

import Globals from '../util/Globals';
import portfolio from '../portfolio';

import '../components/alert-button';

import '../styles/note-cell.less';


export default new Mosaic({
    name: 'note-cell',
    data: {
        note: {}
    },
    selectNote() {
        portfolio.dispatch('select-note', { note: this.data.note });
    },
    moveNote() {
        const { title } = this.data.note;
        Globals.showMoveAlert(`Moving "${title}"`, `Select the notebook that you would like to
        move ${title} into.`, this.data.note);

        const drawer = document.getElementsByTagName('app-drawer')[0];
        if(!drawer) return;

        drawer.style.transform = 'translateX(100%)';
    },
    deleteNote() {
        const { title } = this.data.note;
        Globals.showDeleteAlert(`Deleting "${title}"`, `Are you sure you want to delete
        the note "${title}"? This action can only be reversed with a Noteworthy backup file.`, this.data.note, 1);

        const drawer = document.getElementsByTagName('app-drawer')[0];
        if(!drawer) return;

        drawer.style.transform = 'translateX(100%)';
    },
    view() {
        let created = '-----';
        let modified = '-----';
        created = this.data.note.created ? new Date(this.data.note.created) : new Date();
        modified = this.data.note.modified ? new Date(this.data.note.modified) : new Date();

        return html`<div class='note-cell' onclick='${this.selectNote}'>
            <h2>${this.data.note.title}</h2>
            <p><b>Created:</b> ${created.toDateString() || '-----'}</p>
            <p><b>Last Modified:</b> ${modified.toDateString() || '-----'}</p>

            <alert-button color='#427fdb' click='${this.moveNote.bind(this)}'>MOVE</alert-button>
            <alert-button color='#8F3936' click='${this.deleteNote.bind(this)}'>DELETE</alert-button>
        </div>`
    }
})