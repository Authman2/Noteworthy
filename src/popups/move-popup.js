import Mosaic from 'mosaic-framework';

import * as Networking from '../util/Networking';
import Globals from '../util/Globals';
import Portfolio from '../util/Portfolio';

export default new Mosaic({
    name: 'move-popup',
    element: 'popups',
    portfolio: Portfolio,
    useShadow: false,
    data: {
        notebooks: [],
        selectedNotebook: null
    },
    created: async function() {
        const { ci } = this.data;
        if(ci) {
            const cib = document.getElementById(`ci-Move`);
            this.style.top = `${cib.getBoundingClientRect().top}px`;
        }

        const res = await Networking.loadNotebooks();
        if(res.ok) this.data.notebooks = res.notebooks;
    },
    view: function() {
        const currentNT = this.portfolio.get('currentNote');

        return html`
            <h1>
                Where would you like to move "${currentNT && currentNT.title}" to?
            </h1>
            ${Mosaic.list(this.data.notebooks, nb => nb._id, nb => {
                return html`<li onclick="${() => this.data.selectedNotebook = nb}"
                                style='color: ${this.data.selectedNotebook === nb ? 'white' : 'rgb(54, 54, 54)'};
                                    background-color: ${this.data.selectedNotebook === nb ? 'rgb(209, 209, 209)' : 'rgb(165, 165, 165)'}'>
                    ${nb.title}
                </li>`
            })}

            <round-button onclick='${this.handleMove}'>Move</round-button>
        `
    },
    handleMove: async function() {
        // Get the current note and the notebook you are trying to move it into.
        const currentNT = this.portfolio.get('currentNote');
        const toNotebook = this.data.selectedNotebook;

        if(!toNotebook)
            return Globals.showActionAlert(
                `You must select a notebook to move the note into`, 
                Globals.ColorScheme.red
            );

        // Make the API call and alert the user.
        const res = await Networking.move(currentNT._id, currentNT.notebookID, toNotebook._id);
        Globals.showActionAlert(
            res.message, 
            res.ok ? Globals.ColorScheme.green : Globals.ColorScheme.red
        );
        this.animateAway();
    },
    animateAway: function() {
        this.classList.add('popup-out');
        setTimeout(() => {
            this.classList.remove('popup-out');
            this.remove();
        }, 400);
    }
})