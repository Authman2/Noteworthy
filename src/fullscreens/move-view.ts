import Mosaic, { html } from 'mosaic-framework';

import * as Networking from '../util/Networking';
import * as Globals from '../util/Globals';
import Portfolio from '../util/Portfolio';

export default Mosaic({
    name: 'move-view',
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
        if(this.data.notebooks.length === 0) {
            const res = await Networking.loadNotebooks();
            if(res.ok) this.data.notebooks = res.notebooks;
        }
    },
    view: function() {
        const {
            selectedNotebook,
        } = this.data;

        const note = Portfolio.get('currentNote');
        const created = new Date(note.created || 0).toDateString();
        const edited = new Date(note.modified || 0).toDateString();

        return html`
            <button class='close-button' onclick='${this.animateAway.bind(this)}'>
                <ion-icon name='close'></ion-icon>
            </button>
            <h1>Move</h1>
            <p>Where would you like to move this note too?</p>

            <div class='move-note-info'>
                <i><b>Title:</b> ${note.title}</i>
                <i><b>Created:</b> ${created}</i>
                <i><b>Edited:</b> ${edited}</i>
            </div>

            ${this.showNotebooksList.bind(this)}
            
            <round-button onclick='${this.handleMove}'>
                Move ${note.title} into ${selectedNotebook ? selectedNotebook.title : "------"}
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
    handleMove: async function() {
        // Get the current note and the notebook you are trying to move it into.
        const note = Portfolio.get('currentNote');
        const toNotebook = this.data.selectedNotebook;

        if(!toNotebook)
            return Globals.displayTextAlert(
                `You must select a notebook to move the note into`, 
                Globals.red
            );

        // Make the API call and alert the user.
        const res = await Networking.move(note._id, note.notebookID, toNotebook._id);
        Globals.displayTextAlert(res.message, res.ok ? Globals.green : Globals.red);
        this.animateAway();
    },
});