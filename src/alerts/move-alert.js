import Mosaic from 'mosaic-framework';

import Globals from '../util/Globals';
import * as Networking from '../util/Networking';
import portflio from '../portfolio';

import '../components/alert-button';

import '../styles/alerts.less';


export default new Mosaic({
    name: 'move-alert',
    data: {
        note: {},
        notebooks: []
    },
    cancel() {
        const div = this.getElementsByClassName('modal-alert')[0];
        div.style.opacity = 0;
        setTimeout(() => {
            this.remove();
        }, 500);
        const drawer = document.getElementsByTagName('app-drawer')[0];
        if(drawer) drawer.style.transform = 'translateX(0%)';
    },
    async confirm(notebook) {
        const note = this.data.note;
        const currentNotebook = portflio.get('currentNotebook');
        if(!note.id) return;

        // Make api request to move the note.
        const result = await Networking.move(note.id, currentNotebook.id, notebook.id);
        if(result.ok === true) {
            // Alert the user that the note was moved.
            Globals.showActionAlert(`Moved the note <b>${note.title}</b> from 
            <b>${currentNotebook.title}</b> into the notebook <b>${notebook.title}</b>!`,
            Globals.ColorScheme.blue, 4000);

            // Reload the note list.
            const page = document.getElementsByTagName('notes-page')[0];
            if(page) page.refreshNotes();

            // Close the alert.
            this.cancel();
        } else {
            Globals.showActionAlert(`There was a problem moving the note ${note.title}`, Globals.ColorScheme.red);
        }
    },
    async created() {
        const result = await Networking.loadNotebooks();
        if(result.ok === true) this.data.notebooks = result.notebooks;
        else
            Globals.showActionAlert('Noteworthy could not load your notebooks. Try again later!', Globals.ColorScheme.red);
    },
    view() {
        return html`<div class='modal-alert'>
            <h1>${this.data.title}</h1>
            <p>${this.data.subtitle}</p>

            ${this.data.notebooks.map(notebook => {
                return html`<div class='move-cell' onclick='${this.confirm.bind(this, notebook)}'>
                    ${notebook.title}
                </div>`
            })}

            <alert-button color='gray' onclick='${this.cancel.bind(this)}'>CANCEL</alert-button>
        </div>`
    }
})