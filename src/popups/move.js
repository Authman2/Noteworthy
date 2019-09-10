import Mosaic from 'mosaic-framework';

import '../components/round-button';

import * as Networking from '../util/Networking';
import Globals from '../util/Globals';
import Portfolio from '../util/Portfolio';


// Export the main component.
export default new Mosaic({
    name: 'move-popup',
    element: 'popups',
    portfolio: Portfolio,
    data: {
        notebooks: [],
        selectedNB: null
    },
    async created() {
        const res = await Networking.loadNotebooks();
        if(!res.ok) return;
        this.data.notebooks = res.notebooks;
    },
    async handleMove() {

    },
    view() {
        const note = Portfolio.get('currentNote');

        return html`
        ${
            note ? 
                this.hasNote.call(this, note) : 
                html`<h2>Please select a note in order to move it to a different notebook.</h2>`
        }
        `
    },
    hasNote(note) {
        return html`
        <h2>Move</h2>
        <p>Where would you like to move ${note.title} to?</p>
        ${Mosaic.list(this.data.notebooks, nb => nb.id, nb => {
            const cnb = this.data.selectedNB;
            if(cnb && cnb.id === nb.id) {
                return html`<button class='select-notebook-btn' onclick='${() => {
                    this.data.selectedNB = nb;
                    this.repaint();
                }}' style='background-color: cornflowerblue'>
                    ${nb.title}
                </button>`
            } else {
                return html`<button class='select-notebook-btn' onclick='${() => {
                    this.data.selectedNB = nb;
                }}' style='background-color: rgb(181, 202, 241)'>
                    ${nb.title}
                </button>`
            }
        })}
        <br><br>

        <round-button icon='document' highlightColor='#707070' onclick='${this.handleMove}'>
            Move!
        </round-button>`
    }
});