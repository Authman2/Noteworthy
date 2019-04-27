import Mosaic from '@authman2/mosaic';
import Moment from 'moment';

import Globals from '../util/Globals';
import portfolio from '../portfolio';

export default new Mosaic({
    portfolio,
    data: {
        type: 'Notebook'
    },
    actions: {
        close() {
            this.portfolio.dispatch('close-alert');
        },
        toggle() {
            this.data.type = this.data.type === 'Notebook' ? 'Note' : 'Notebook';
        },
        create() {
            if(this.data.type === 'Note') {
                let cnb = this.portfolio.get('currentNotebook');
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
                notebookID: this.portfolio.get('currentNotebook').id,
                content: "",
            };
            
            // Call the api endpoint.

            Globals.showActionAlert(`Created ${newData.type.toLowerCase()} called <b>${newData.obj.title}</b>`, Globals.ColorScheme.blue);
            this.portfolio.dispatch('close-alert');
        }
    },
    view() {
        return html`<div class='popup'>
            <button class='close-btn' onclick='${this.actions.close}'><span class='fa fa-times'></span></button>

            <h1 class='popup-title'>Create New ${this.data.type}</h1>
            <h4 class='popup-subtitle'>Enter a name for your new ${this.data.type}</h4>

            <input class='underline-field' placeholder="Title" id='create-name-field'>
            <button class='popup-btn' onclick='${this.actions.toggle}'>
                Switch to ${ this.data.type === 'Notebook' ? 'Note' : 'Notebook' }
            </button>
            <br>
            <button class='popup-btn' onclick='${this.actions.create}'>Create ${ this.data.type }</button>
            <br><br>
        </div>`
    }
});