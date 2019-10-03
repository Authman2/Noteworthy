import Mosaic from 'mosaic-framework';

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
            ${Mosaic.list(this.data.notes, nt => nt._id, nt => {
                return html`<li onclick="${this.selectNote.bind(this, nt)}">
                    ${nt.title}
                </li>`
            })}
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
    animateAway: function() {
        this.classList.add('popup-out');
        setTimeout(() => {
            this.classList.remove('popup-out');
            this.remove();
        }, 400);
    }
})