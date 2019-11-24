import Mosaic, { html } from 'mosaic-framework';

import * as Networking from '../util/Networking';
import * as Globals from '../util/Globals';
import Portfolio from '../util/Portfolio';

export default Mosaic({
    name: 'favorites-view',
    element: 'fullscreens',
    useShadow: false,
    data: {
        favorites: [],
        selectedNote: undefined
    },
    created: async function() {
        // Load the user's favorite notes.
        const res = await Networking.getFavorites();
        if(res.ok) this.data.favorites = res.favorites;
    },
    updated: async function() {
        if(this.data.favorites.length === 0) {
            const res = await Networking.getFavorites();
            if(res.ok) this.data.favorites = res.favorites;
        }
    },
    view: function() {
        const { selectedNote } = this.data;

        return html`
            <button class='close-button' onclick='${this.animateAway.bind(this)}'>
                <ion-icon name='close'></ion-icon>
            </button>
            <h1>Favorites</h1>
            <p>Select a note to open:</p>

            ${this.showNoteList.bind(this)}
            
            <round-button onclick='${this.handleOpen}' color='black'>
                Open ${selectedNote ? selectedNote.title : "------"}
            </round-button>
            <round-button onclick='${this.handleDelete}' color='black'>
                Delete ${selectedNote ? selectedNote.title : "------"}
            </round-button>
        `
    },
    showNoteList: function() {
        const selectNT = nt => this.data.selectedNote = nt;
        const { selectedNote, favorites } = this.data;

        return html`<div class='n-list'>
            ${Mosaic.list(favorites, nt => nt._id, nt => {
                return html`<li onclick="${selectNT.bind(this, nt)}"
                                style='color: ${selectedNote === nt ? 'white' : '#60A4EB'};
                                background-color: ${selectedNote === nt ? '#60A4EB' : 'white'}'>
                    ${nt.title}
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
        const { selectedNote } = this.data;
        
        if(!selectedNote)
            return Globals.displayTextAlert('Please select a note to open', Globals.red);
        else {
            Portfolio.dispatch('select-note', {
                currentNote: selectedNote
            });
            Globals.displayTextAlert(`Opened the note "${selectedNote.title}"`, Globals.blue);

            // Update the UI for opening the note.
            const title = document.getElementById('title-field');
            const note = document.getElementById('note-field');
            title.innerHTML = selectedNote.title;
            note.innerHTML = selectedNote.content;

            const favoriteButton = document.getElementById('ci-Favorite');
            if(selectedNote.favorited === true) {
                favoriteButton.style.color = '#FF6EA4';
                favoriteButton.style.backgroundColor = '#E2E2E2';
            } else {
                favoriteButton.style.color = 'white';
                favoriteButton.style.backgroundColor = '#AAAAAA'
            }

            const page = document.getElementsByTagName('work-page')[0];
            if(page) {
                page.scrollTo({
                    top: 0,
                    behavior: 'auto'
                });
            }
            this.animateAway();
        }
    },
    handleDelete: async function() {
        const { selectedNote: nt } = this.data;

        if(!nt)
            return Globals.displayTextAlert('Please select a notebook to delete', Globals.red);

        Globals.displayConfirmationAlert(
            `Are you sure you want to delete "${nt.title}"? This action cannot be undone.`,
            Globals.gray,
            async () => {
                const resp = await Networking.deleteNote(nt._id);
                Globals.displayTextAlert(resp.message, resp.ok ? Globals.green : Globals.red);
            }
        )
    }
});