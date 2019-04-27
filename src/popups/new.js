import Mosaic from '@authman2/mosaic';
import Moment from 'moment';

import Globals from '../util/Globals';
import { portfolio } from '../portfolio';

const newAlert = new Mosaic({
    data: {
        type: 'Notebook'
    },
    actions: {
        close() {
            portfolio.dispatch('close-alert');
        },
        toggle() {
            this.data.type = this.data.type === 'Notebook' ? 'Note' : 'Notebook';
        },
        create() {
            if(this.data.type === 'Note') {
                let cnb = portfolio.get('currentNotebook');
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
            const newObj = this.data.type === 'Notebook' ? { title } : {
                title,
                notebookID: portfolio.get('currentNotebook').id,
                content: "",
            };
            
            // Call the api endpoint.

            Globals.showActionAlert(`Created ${newData.type.toLowerCase()} called <b>${newData.obj.title}</b>`, Globals.ColorScheme.blue);
            portfolio.dispatch('close-alert');
        }
    },
    view: self => html`<div class='popup'>
        <button class='close-btn' onclick='${self.actions.close.bind(self)}'><span class='fa fa-times'></span></button>

        <h1 class='popup-title'>Create New ${self.data.type}</h1>
        <h4 class='popup-subtitle'>Enter a name for your new ${self.data.type}</h4>

        <input class='underline-field' placeholder="Title" id='create-name-field'>
        <button class='popup-btn' onclick='${self.actions.toggle}'>
            Switch to ${ self.data.type === 'Notebook' ? 'Note' : 'Notebook' }
        </button>
        <br>
        <button class='popup-btn' onclick='${self.actions.create}'>Create ${ self.data.type }</button>
        <br><br>
    </div>`
});
export default newAlert;