import Mosaic from 'mosaic-framework';

import Portfolio from '../util/Portfolio';
import Globals from '../util/Globals';
import * as Networking from '../util/Networking';

import '../styles/alerts.less';


export default new Mosaic({
    name: 'content-view',
    portfolio: Portfolio,
    async handleTrash() {
        const titleField = document.getElementById('title-field');
        const noteField = document.getElementById('note-field');
        
        // Show an action alert.
        Globals.showActionAlert(`
            Are you sure you want to delete this note?
            <round-button highlightColor='cornflowerblue' id='toast-yes-btn'>Yes</round-button>
            <round-button highlightColor='red' id='toast-no-btn'>No</round-button>
        `, Globals.ColorScheme.red, 0);

        // Define event listeners.
        const confirmBtn = document.getElementById('toast-yes-btn');
        const declineBtn = document.getElementById('toast-no-btn');
        confirmBtn.onclick = async () => {
            const note = Portfolio.get('currentNote');
            if(note) {
                const res = await Networking.deleteNote(note.id);
                Globals.showActionAlert(res.message, Globals.ColorScheme.green);
            }

            titleField.innerHTML = 'Title';
            noteField.innerHTML = 'Start typing here';

            Globals.hideActionAlert();
        }
        declineBtn.onclick = () => {
            Globals.hideActionAlert();
        }
    },
    view() {
        const note = this.portfolio.get('currentNote');

        return html`
        <p id='created-field'>
            ${(note && note.created && `Created: ${new Date(note.created).toDateString()}`) || ""}
        </p>
        <p id='modified-field'>
            ${(note && note.modified && `Modified: ${new Date(note.modified).toDateString()}`) || ""}
        </p>

        <div id='title-field' contenteditable="true">Title</div>
        <div id='note-field' contenteditable="true">Start typing here</div>

        <ion-icon name="trash" onclick="${this.handleTrash}"></ion-icon>
        `
    }
})