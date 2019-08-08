import Mosaic from 'mosaic-framework';
import '@polymer/paper-spinner/paper-spinner.js';

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
        const result = await Networking.loadNotes(currentNotebook.id);
        if(result.ok === true) {
            if(result.notes.notes) this.data.notes = result.notes.notes;
        } else {
            Globals.showActionAlert(result.err, Globals.ColorScheme.red);
        }
    },
    view() {
        return html`${this.data.notes.length > 0 ?
            this.data.notes
                .filter(note => {
                    const srh = portfolio.get('search');
                    if(srh && srh.length > 0) {
                        const reg = new RegExp(srh, 'gi');
                        return reg.test(note.title);
                    } else {
                        return true;
                    }
                })
                .map(note => {
                    return html`<note-cell note='${note}'></note-cell>`
                })
            :
            html`<page-spinner active></page-spinner>`
        }`
    }
})