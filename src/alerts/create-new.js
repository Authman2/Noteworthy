import Mosaic from 'mosaic-framework';

import Globals from '../util/Globals';
import * as Networking from '../util/Networking';
import portfolio from '../portfolio';

import '../components/alert-button';
import '../components/underline-field';

import '../styles/alerts.less';


export default new Mosaic({
    name: 'create-new-alert',
    element: 'alerts',
    data: {
        type: 'Notebook'
    },
    cancel() {
        document.getElementById('create-field').firstChild.value = '';
        const div = this.getElementsByClassName('modal-alert')[0];
        div.style.opacity = 0;
        setTimeout(() => {
            div.style.opacity = 1;
            this.remove();
        }, 500);
        const drawer = document.getElementsByTagName('app-drawer')[0];
        if(drawer) drawer.style.transform = 'translateX(0%)';
    },
    async confirm() {
        const name = document.getElementById('create-field').firstChild.value || '';
        if(name && name.length > 0) {
            let cnb = portfolio.get('currentNotebook');
            if(this.data.type === 'Note') {
                if(!cnb) {
                    Globals.showActionAlert(`You must select a notebook before you can create a note.`, Globals.ColorScheme.red);
                    return;
                }
            }

            // Create title.
            const title = name;
            
            // Call the api endpoint.
            if(this.data.type === 'Note') {
                const result = await Networking.createNote(title, '', cnb.id);
                if(result.ok === false) return Globals.showActionAlert(`${result.err}`, Globals.ColorScheme.red);
                else {
                    // Reload the note list.
                    const page = document.getElementsByTagName('notes-page')[0];
                    if(page) page.refreshNotes();
                }
            } else {
                const result = await Networking.createNotebook(title);
                if(result.ok === false) return Globals.showActionAlert(`${result.err}`, Globals.ColorScheme.red);
                else {
                    // Reload the notebook list.
                    const page = document.getElementsByTagName('notebooks-page')[0];
                    if(page) page.refreshNotebooks();
                }
            }

            document.getElementById('create-field').firstChild.value = '';
            Globals.showActionAlert(`Created ${this.data.type.toLowerCase()} called <b>${title}</b>`, Globals.ColorScheme.blue);
            this.cancel();
        } else {
            Globals.showActionAlert('Please enter a name before continuing.', Globals.ColorScheme.red, 3000);
        }
    },
    view() {
        return html`<div class='modal-alert'>
            <h1>Create ${this.data.type}</h1>
            <p>Enter the name of your new ${this.data.type.toLowerCase()}</p>
            <underline-field type='tect' place='Name' id='create-field'></underline-field>

            <alert-button color='gray' onclick='${this.cancel}'>CANCEL</alert-button>
            <alert-button color='#427fdb' onclick='${this.confirm}'>CREATE</alert-button>
        </div>`
    }
})