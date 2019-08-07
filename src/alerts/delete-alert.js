import Mosaic from 'mosaic-framework';

import Globals from '../util/Globals';
import * as Networking from '../util/Networking';

import '../components/alert-button';

import '../styles/alerts.less';


export default new Mosaic({
    name: 'delete-alert',
    cancel() {
        const div = this.getElementsByClassName('modal-alert')[0];
        div.style.opacity = 0;
        setTimeout(() => {
            this.remove();
        }, 500);
        const drawer = document.getElementsByTagName('app-drawer')[0];
        if(drawer) drawer.style.transform = 'translateX(0%)';
    },
    async confirm() {
        const { note, type } = this.data;
        if(!note.id) return;

        // Make api request to delete the note/notebook.
        if(type === 0) {
            const result = await Networking.deleteNotebook(note.id);
            if(result.ok) {
                Globals.showActionAlert(`Deleted the notebook ${note.title}!`, Globals.ColorScheme.blue, 4000);
                
                // Reload the notebook list.
                const page = document.getElementsByTagName('notebooks-page')[0];
                if(page) page.refreshNotebooks();

                this.cancel();
            } else {
                Globals.showActionAlert(result.err, Globals.ColorScheme.red, 4000);
            }
        } else {
            const result = await Networking.deleteNote(note.id);
            if(result.ok) {
                Globals.showActionAlert(`Deleted the note ${note.title}!`, Globals.ColorScheme.blue, 4000);
                
                // Reload the note list.
                const page = document.getElementsByTagName('notes-page')[0];
                if(page) page.refreshNotes();

                this.cancel();
            } else {
                Globals.showActionAlert(result.err, Globals.ColorScheme.red, 4000);
            }
        }
    },
    view() {
        return html`<div class='modal-alert'>
            <h1>${this.data.title}</h1>
            <p>${this.data.subtitle}</p>

            <alert-button color='gray' onclick='${this.cancel}'>CANCEL</alert-button>
            <alert-button color='#8F3936' onclick='${this.confirm}'>DELETE</alert-button>
        </div>`
    }
})