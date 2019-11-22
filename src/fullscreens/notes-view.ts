import Mosaic, { html } from 'mosaic-framework';

import * as Networking from '../util/Networking';
import * as Globals from '../util/Globals';
import Portfolio from '../util/Portfolio';

export default Mosaic({
    name: 'notes-view',
    element: 'fullscreens',
    useShadow: false,
    data: {
        notes: [],
        selectedNote: undefined
    },
    created: async function() {
        // Load the notes for the current notebook.
        const nb = Portfolio.get('currentNotebook');
        const res = await Networking.loadNotes(nb._id);
        if(res.ok) this.data.notes = res.notes;
    },
    updated: async function() {
        if(this.data.type === 1 && this.data.notes.length === 0) {
            const nb = Portfolio.get('currentNotebook');
            const res = await Networking.loadNotes(nb._id);
            if(res.ok) this.data.notes = res.notes;
        }
    },
    view: function() {
        const { selectedNote } = this.data;
        const nb = Portfolio.get('currentNotebook');

        return html`
            <button class='close-button' onclick='${this.animateAway.bind(this)}'>
                <ion-icon name='close'></ion-icon>
            </button>
            <h1>Notes in "${nb.title}"</h1>
            <p>Select a note to open:</p>

            ${this.showNoteList.bind(this)}
            
            <round-button onclick='${this.handleOpen}'>
                Open ${selectedNote ? selectedNote.title : "------"}
            </round-button>
            <round-button onclick='${this.handleDelete}'>
                Delete ${selectedNote ? selectedNote.title : "------"}
            </round-button>
        `
    },
    showNoteList: function() {
        const selectNT = nt => this.data.selectedNote = nt;
        const { selectedNote, notes } = this.data;

        return html`<div class='n-list'>
            ${Mosaic.list(notes, nt => nt._id, nt => {
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
// export default Mosaic({
//     name: 'notes-view',
//     element: 'popups',
//     portfolio: Portfolio,
//     useShadow: false,
//     data: {
//         notes: [],
//     },
//     created: async function() {
//         const { ci } = this.data;
//         if(ci) {
//             const cib = document.getElementById(`ci-Notes`);
//             this.style.top = `${cib.getBoundingClientRect().top}px`;
//         }

//         const currentNB = this.portfolio.get('currentNotebook');
//         if(!currentNB) return;

//         const res = await Networking.loadNotes(currentNB._id);
//         if(res.ok) this.data.notes = res.notes;
//     },
//     view: function() {
//         const currentNB = this.portfolio.get('currentNotebook');

//         return html`
//             <h1>Notes in ${currentNB ? currentNB.title : "None"}:</h1>
            
//             ${() => {
//                 if(this.data.notes.length === 0) {
//                     return html`<paper-spinner active></paper-spinner>`;
//                 } else {
//                     return html`<div>
//                         ${Mosaic.list(this.data.notes, nt => nt._id, nt => {
//                             return html`<div>
//                                 <li onclick="${this.selectNote.bind(this, nt)}">
//                                     ${nt.title}
//                                 </li>
//                                 <ion-icon name='close' onclick='${this.handleDelete.bind(this, nt)}'>
//                                 </ion-icon>    
//                             </div>`
//                         })}
//                     </div>`
//                 }
//             }}
//             `
//     },
//     selectNote: function(nt) {
//         const title = document.getElementById('title-field');
//         const note = document.getElementById('note-field');

//         // Send to the portfolio.
//         Portfolio.dispatch('select-note', {
//             currentNote: nt
//         });

//         // Update the fields.
//         title.innerHTML = nt.title;
//         note.innerHTML = nt.content;

//         // Update whether or not this note is favorited.
//         const favoriteButton = document.getElementById('ci-Favorite');
//         if(nt.favorited === true) {
//             favoriteButton.style.color = '#FF6EA4';
//             favoriteButton.style.backgroundColor = '#E2E2E2';
//         } else {
//             favoriteButton.style.color = 'white';
//             favoriteButton.style.backgroundColor = '#AAAAAA'
//         }

//         // Alert the user.
//         Globals.showActionAlert(
//             `Opened the note ${nt.title}`,
//             Globals.ColorScheme.blue
//         );
//         this.animateAway();

//         // Scroll to the top.
//         document.body.scrollTo({ top: 0, behavior: 'smooth' });
//     },
//     handleDelete: function(note) {
//         Globals.showActionAlert(
//             `Are you sure you want to delete the note "${note.title}"?.
//             <br>
//             <round-button id='delete-alert-button-yes' color='crimson'>Yes, delete</round-button>
//             <round-button id='delete-alert-button-no' color='gray'>No, cancel</round-button>`,
//             Globals.ColorScheme.gray,
//             0
//         );

//         const yesBtn = document.getElementById('delete-alert-button-yes');
//         const noBtn = document.getElementById('delete-alert-button-no');
//         yesBtn.onclick = async () => {
//             const resp = await Networking.deleteNote(note._id);
//             Globals.showActionAlert(
//                 resp.message,
//                 resp.ok ? Globals.ColorScheme.green : Globals.ColorScheme.red
//             );
//         }
//         noBtn.onclick = () => {
//             Globals.hideActionAlert();
//         }
//     },
//     animateAway: function() {
//         this.classList.add('popup-out');
//         setTimeout(() => {
//             this.classList.remove('popup-out');
//             this.remove();
//         }, 400);
//     }
// })