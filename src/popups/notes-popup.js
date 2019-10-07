import Mosaic from 'mosaic-framework';
import '@polymer/paper-spinner/paper-spinner.js';

import * as Networking from '../util/Networking';
import Globals from '../util/Globals';
import Portfolio from '../util/Portfolio';

export default new Mosaic({
    name: 'notes-popup',
    element: 'popups',
    portfolio: Portfolio,
    useShadow: false,
    data: {
        notes: [],
    },
    created: async function() {
        const { ci } = this.data;
        if(ci) {
            const cib = document.getElementById(`ci-Notes`);
            this.style.top = `${cib.getBoundingClientRect().top}px`;
        }

        const currentNB = this.portfolio.get('currentNotebook');
        if(!currentNB) return;

        const res = await Networking.loadNotes(currentNB._id);
        if(res.ok) this.data.notes = res.notes;
    },
    view: function() {
        const currentNB = this.portfolio.get('currentNotebook');

        return html`
            <h1>Notes in ${currentNB ? currentNB.title : "None"}:</h1>
            
            ${() => {
                if(this.data.notes.length === 0) {
                    return html`<paper-spinner active></paper-spinner>`;
                } else {
                    return html`<div>
                        ${Mosaic.list(this.data.notes, nt => nt._id, nt => {
                            return html`<div>
                                <li onclick="${this.selectNote.bind(this, nt)}">
                                    ${nt.title}
                                </li>
                                <ion-icon name='close' onclick='${this.handleDelete.bind(this, nt)}'>
                                </ion-icon>    
                            </div>`
                        })}
                    </div>`
                }
            }}
            `
    },
    selectNote: function(nt) {
        const title = document.getElementById('title-field');
        const note = document.getElementById('note-field');

        // Send to the portfolio.
        Portfolio.dispatch('select-note', {
            currentNote: nt
        });

        // Update the fields.
        title.innerHTML = nt.title;
        note.innerHTML = nt.content;

        // Update whether or not this note is favorited.
        const favoriteButton = document.getElementById('ci-Favorite');
        if(nt.favorited === true) {
            favoriteButton.style.color = '#FF6EA4';
            favoriteButton.style.backgroundColor = '#E2E2E2';
        } else {
            favoriteButton.style.color = 'white';
            favoriteButton.style.backgroundColor = '#AAAAAA'
        }

        // Alert the user.
        Globals.showActionAlert(
            `Opened the note ${nt.title}`,
            Globals.ColorScheme.blue
        );
        this.animateAway();

        // Scroll to the top.
        document.body.scrollTo({ top: 0, behavior: 'smooth' });
    },
    handleDelete: function(note) {
        Globals.showActionAlert(
            `Are you sure you want to delete the note "${note.title}"?.
            <br>
            <round-button id='delete-alert-button-yes' color='crimson'>Yes, delete</round-button>
            <round-button id='delete-alert-button-no' color='gray'>No, cancel</round-button>`,
            Globals.ColorScheme.gray,
            0
        );

        const yesBtn = document.getElementById('delete-alert-button-yes');
        const noBtn = document.getElementById('delete-alert-button-no');
        yesBtn.onclick = async () => {
            const resp = await Networking.deleteNote(note._id);
            Globals.showActionAlert(
                resp.message,
                resp.ok ? Globals.ColorScheme.green : Globals.ColorScheme.red
            );
        }
        noBtn.onclick = () => {
            Globals.hideActionAlert();
        }
    },
    animateAway: function() {
        this.classList.add('popup-out');
        setTimeout(() => {
            this.classList.remove('popup-out');
            this.remove();
        }, 400);
    }
})