import Mosaic, { html } from 'mosaic-framework';

import * as Networking from '../util/Networking';
import * as Globals from '../util/Globals';
import Portfolio from '../util/Portfolio';

export default Mosaic({
    name: 'notebooks-view',
    element: 'fullscreens',
    useShadow: false,
    data: {
        notebooks: [],
        selectedNotebook: undefined
    },
    created: async function() {
        // Load the notebooks for the first time.
        const res = await Networking.loadNotebooks();
        if(res.ok) this.data.notebooks = res.notebooks;
    },
    updated: async function() {
        if(this.data.type === 1 && this.data.notebooks.length === 0) {
            const res = await Networking.loadNotebooks();
            if(res.ok) this.data.notebooks = res.notebooks;
        }
    },
    view: function() {
        const {
            selectedNotebook,
        } = this.data;

        return html`
            <button class='close-button' onclick='${this.animateAway.bind(this)}'>
                <ion-icon name='close'></ion-icon>
            </button>
            <h1>Notebooks</h1>
            <p>Select a notebook to open:</p>

            ${this.showNotebooksList.bind(this)}
            
            <round-button onclick='${this.handleOpen}'>
                Open ${selectedNotebook ? selectedNotebook.title : "------"}
            </round-button>
            <round-button onclick='${this.handleDelete}'>
                Delete ${selectedNotebook ? selectedNotebook.title : "------"}
            </round-button>
        `
    },
    showNotebooksList: function() {
        const selectNB = nb => this.data.selectedNotebook = nb;
        const { selectedNotebook, notebooks } = this.data;

        return html`<div class='n-list'>
            ${Mosaic.list(notebooks, nb => nb._id, nb => {
                return html`<li onclick="${selectNB.bind(this, nb)}"
                                style='color: ${selectedNotebook === nb ? 'white' : '#60A4EB'};
                                background-color: ${selectedNotebook === nb ? '#60A4EB' : 'white'}'>
                    ${nb.title}
                </li>`
            })}
        </div>`
    },
    animateAway: function() {
        this.classList.add('fs-out');
        setTimeout(() => {
            this.classList.remove('fs-out');
            this.remove();
        }, 500);
    },
    handleOpen: async function() {
        const { selectedNotebook } = this.data;
        
        if(!selectedNotebook)
            return Globals.displayTextAlert('Please select a notebook to open', Globals.red);
        else {
            Portfolio.dispatch('select-notebook', {
                currentNotebook: selectedNotebook
            });
            Globals.displayTextAlert(`Opened the notebook ${selectedNotebook.title}`, Globals.blue);
            this.animateAway();
        }
    },
    handleDelete: async function() {
        const { selectedNotebook: nb } = this.data;

        if(!nb)
            return Globals.displayTextAlert('Please select a notebook to delete', Globals.red);

        Globals.displayConfirmationAlert(
            `Are you sure you want to delete "${nb.title}"? This will delete all notes inside of it as well.`,
            Globals.gray,
            async () => {
                const resp = await Networking.deleteNotebook(nb._id);
                Globals.displayTextAlert(resp.message, resp.ok ? Globals.green : Globals.red);
            }
        )
    }
});