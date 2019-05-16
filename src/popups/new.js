import Mosaic from '@authman2/mosaic';

import Globals from '../util/Globals';
import { portfolio } from '../portfolio';
import Networking from '../util/Networking';

const newAlert = new Mosaic({
    data: {
        type: 'Note'
    },
    actions: {
        close() {
            portfolio.dispatch('close-alert');
        },
        toggle() {
            this.data.type = this.data.type === 'Notebook' ? 'Note' : 'Notebook';
        },
        async create() {
            let cnb = portfolio.get('currentNotebook');
            if(this.data.type === 'Note') {
                if(!cnb) {
                    Globals.showActionAlert(`You must select a notebook before you can create a note.`, Globals.ColorScheme.red);
                    return;
                }
            }

            let field = document.getElementById('create-name-field');
            if(field.value.length < 1) {
                Globals.showActionAlert(`Please enter a name for this ${this.data.type.toLowerCase()}.`, Globals.ColorScheme.red);
                return;
            }

            // Create notebook
            const title = field.value;
            
            // Call the api endpoint.
            if(this.data.type === 'Note') {
                const result = await Networking.createNote(title, '', cnb.id);
                if(result.ok === false) return Globals.showActionAlert(`${result.err}`, Globals.ColorScheme.red);
            } else {
                const result = await Networking.createNotebook(title);
                if(result.ok === false) return Globals.showActionAlert(`${result.err}`, Globals.ColorScheme.red);
            }

            Globals.showActionAlert(`Created ${this.data.type.toLowerCase()} called <b>${title}</b>`, Globals.ColorScheme.blue);
            portfolio.dispatch('close-alert');
        }
    },
    view: self => html`<div class='popup-backdrop'>
        <div class='popup'>
            <button class='close-btn' onclick='${self.actions.close.bind(self)}'><span class='fa fa-times'></span></button>

            <h1 class='popup-title'>Create New ${self.data.type}</h1>
            <h4 class='popup-subtitle'>Enter a name for your new ${self.data.type}</h4>

            <input class='underline-field' placeholder="Title" id='create-name-field'>
            <div class="buttons-area">
                <button class='rect-btn hollow-btn' onclick='${self.actions.toggle}'>
                    Switch to ${ self.data.type === 'Notebook' ? 'Note' : 'Notebook' }
                </button>
                &nbsp;
                <button class='rect-btn' onclick='${self.actions.create}'>Create ${ self.data.type }</button>
            </div>
            <br><br>
        </div>
    </div>`
});
export default newAlert;