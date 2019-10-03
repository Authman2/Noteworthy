import Mosaic from 'mosaic-framework';

import * as Networking from '../util/Networking';
import Globals from '../util/Globals';


export default new Mosaic({
    name: 'new-popup',
    element: 'popups',
    useShadow: false,
    data: {
        type: 0,
        notebooks: [],
        selectedNotebook: null,
        ci: null
    },
    created: function() {
        const { ci } = this.data;
        if(ci) {
            const cib = document.getElementById(`ci-New`);
            this.style.top = `${cib.getBoundingClientRect().top}px`;
        }
    },
    updated: async function() {
        if(this.data.type === 1 && this.data.notebooks.length === 0) {
            const res = await Networking.loadNotebooks();
            if(res.ok) this.data.notebooks = res.notebooks;
        }
    },
    view: function() {
        const { type } = this.data;

        return html`
            <popup-button color='${type === 0 ? "#2E31B2" : "#E7E7E7"}'
                style='color: ${type === 0 ? 'white' : '#979797'}'
                onclick='${() => this.data.type = 0}'>
                Notebook
            </popup-button>
            
            <popup-button color='${type === 1 ? "#2E31B2" : "#E7E7E7"}'
                style='color: ${type === 1 ? 'white' : '#979797'}'
                onclick='${() => this.data.type = 1}'>
                Note
            </popup-button>

            <text-field id='create-title-field' title='Title'></text-field>

            ${this.showNotebooksList.bind(this)}

            <round-button onclick='${this.handleCreate}'>Create</round-button>
        `
    },
    showNotebooksList: function() {
        const selectNB = nb => {
            this.data.selectedNotebook = nb;
        }
        const { selectedNotebook } = this.data;
        if(this.data.type === 1)
            return html`<div id='notebooks-list-for-new-popup'>
                ${Mosaic.list(this.data.notebooks, nb => nb._id, nb => {
                    return html`<li onclick="${selectNB.bind(this, nb)}"
                                    style='color: ${selectedNotebook === nb ? 'white' : 'rgb(54, 54, 54)'};
                                    background-color: ${selectedNotebook === nb ? 'rgb(209, 209, 209)' : 'rgb(165, 165, 165)'}'>
                        ${nb.title}
                    </li>`
                })}
            </div>`
        else
            return html`<div></div>`;
    },
    animateAway: function() {
        this.classList.add('popup-out');
        setTimeout(() => {
            this.classList.remove('popup-out');
            this.remove();
        }, 400);
    },
    handleCreate: async function() {
        const titleField = document.getElementById('create-title-field');
        const title = titleField.getValue();
        if(!title)
            return Globals.showActionAlert(
                'Please enter a title first.', 
                Globals.ColorScheme.red
            );
        
        // Notebook.
        if(this.data.type === 0) {
            const resp = await Networking.createNotebook(title);
            Globals.showActionAlert(
                resp.message, 
                resp.ok ? Globals.ColorScheme.green : Globals.ColorScheme.red
            );
        } 
        // Note.
        else {
            const selNB = this.data.selectedNotebook;
            if(!selNB)
                return Globals.showActionAlert(
                    'Please select a notebook to add this note to.', 
                    Globals.ColorScheme.red
                );

            const resp = await Networking.createNote(title, '', selNB._id);
            Globals.showActionAlert(
                resp.message,
                resp.ok ? Globals.ColorScheme.green : Globals.ColorScheme.red
            );
        }

        this.animateAway();
    }
})