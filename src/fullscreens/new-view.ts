import Mosaic, { html } from 'mosaic-framework';

import * as Networking from '../util/Networking';
import * as Globals from '../util/Globals';


export default Mosaic({
    name: 'new-view',
    element: 'fullscreens',
    useShadow: false,
    data: {
        isNotebook: true,
        notebooks: [],
        selectedNotebook: undefined
    },
    created: async function() {
        // Load the notebooks for the first time.
        const res = await Networking.loadNotebooks()
        if(res.ok)
            this.data.notebooks = res.notebooks;
    },
    updated: async function() {
        if(this.data.type === 1 && this.data.notebooks.length === 0) {
            const res = await Networking.loadNotebooks();
            if(res.ok) this.data.notebooks = res.notebooks;
        }
    },
    view: function() {
        const {
            isNotebook,
            title,
            subtitle
        } = this.data;

        return html`
            <button class='close-button' onclick='${this.animateAway.bind(this)}'>
                <ion-icon name='close'></ion-icon>
            </button>
            <h1>Create</h1>
            <p>What are you creating today?</p>
            <text-field id='create-title-field' title='Title'></text-field>
        
            <popup-button color='${isNotebook ? "#2E31B2" : "#E7E7E7"}'
                style='color: ${isNotebook ? 'white' : '#979797'}'
                onclick='${() => this.data.isNotebook = true}'>
                Notebook
            </popup-button>
            <popup-button color='${!isNotebook ? "#2E31B2" : "#E7E7E7"}'
                style='color: ${!isNotebook ? 'white' : '#979797'}'
                onclick='${() => this.data.isNotebook = false}'>
                Note
            </popup-button>

            ${this.showNotebooksList.bind(this)}
            <round-button onclick='${this.handleCreate}'>
                Create ${isNotebook ? 'Notebook' : 'Note'}
            </round-button>
        `
    },
    showNotebooksList: function() {
        const selectNB = nb => this.data.selectedNotebook = nb;
        const { selectedNotebook } = this.data;

        if(!this.data.isNotebook)
            return html`<div class='n-list'>
                <h5>Select a notebook to add your new note to:</h5>
                ${Mosaic.list(this.data.notebooks, nb => nb._id, nb => {
                    return html`<li onclick="${selectNB.bind(this, nb)}"
                                    style='color: ${selectedNotebook === nb ? 'white' : '#60A4EB'};
                                    background-color: ${selectedNotebook === nb ? '#60A4EB' : 'white'}'>
                        ${nb.title}
                    </li>`
                })}
            </div>`
        else
            return html`<div></div>`;
    },
    animateAway: function() {
        this.classList.add('fs-out');
        setTimeout(() => {
            this.classList.remove('fs-out');
            this.remove();
        }, 500);
    },
    handleCreate: async function() {
        const titleField = document.getElementById('create-title-field');
        const title = (titleField as any).getValue();
        if(!title)
            return Globals.displayTextAlert('Please enter a title first.', Globals.red);
        
        // Notebook.
        if(this.data.type === 0) {
            const resp = await Networking.createNotebook(title);
            Globals.displayTextAlert(resp.message, resp.ok ? Globals.green : Globals.red);
        } 
        // Note.
        else {
            const selNB = this.data.selectedNotebook;
            if(!selNB)
                return Globals.displayTextAlert(
                    'Please select a notebook to add this note to.', 
                    Globals.red
                );

            const resp = await Networking.createNote(title, '', selNB._id);
            Globals.displayTextAlert(resp.message,resp.ok ? Globals.green : Globals.red);
        }

        this.animateAway();
    }
})