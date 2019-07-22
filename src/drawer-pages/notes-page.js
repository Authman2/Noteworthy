import Mosaic from '@authman2/mosaic';

import Globals from '../util/Globals';
import * as Networking from '../util/Networking';
import portfolio from '../portfolio';

import '../components/note-cell';

import '../styles/notes-page.less';


export default new Mosaic({
    name: 'notes-page',
    data: {
        notes: []
    },
    created() {
        this.class = 'drawer-page';

        // Load the notes for the selected notebook.
        this.refreshNotes();
    },
    async refreshNotes() {
        const currentNotebook = portfolio.get('currentNotebook');
        console.log(currentNotebook);
        const result = await Networking.loadNotes(currentNotebook.id);
        if(result.ok === true) {
            console.log(result.notes);
            if(result.notes.notes) this.data.notes = result.notes.notes;
        } else {
            Globals.showActionAlert(result.err, Globals.ColorScheme.red);
        }
    },
    view() {
        return html`${this.data.notes.map(note => {
            return html`<note-cell note='${note}'></note-cell>`
        })}`
    }
})