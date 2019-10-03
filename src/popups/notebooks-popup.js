import Mosaic from 'mosaic-framework';

import * as Networking from '../util/Networking';
import Globals from '../util/Globals';
import Portfolio from '../util/Portfolio';

export default new Mosaic({
    name: 'notebooks-popup',
    element: 'popups',
    portfolio: Portfolio,
    useShadow: false,
    data: {
        notebooks: [],
    },
    created: async function() {
        const { ci } = this.data;
        if(ci) {
            const cib = document.getElementById(`ci-Notebooks`);
            this.style.top = `${cib.getBoundingClientRect().top}px`;
        }

        const res = await Networking.loadNotebooks();
        if(res.ok) this.data.notebooks = res.notebooks;
    },
    view: function() {
        const currentNB = this.portfolio.get('currentNotebook');

        return html`
            <h1>
                Current Notebook:
                <br>
                ${currentNB ? currentNB.title : "None"}
            </h1>
            ${this.showNotebooksList.bind(this)}
        `
    },
    showNotebooksList: function() {
        const selectNB = nb => {
            this.portfolio.dispatch('select-notebook', {
                currentNotebook: nb
            });
            Globals.showActionAlert(
                `Opened the notebook ${nb.title}`,
                Globals.ColorScheme.blue
            );
            this.animateAway();
        }
        
        return html`<div id='notebooks-list-for-notebooks-popup'>
            ${Mosaic.list(this.data.notebooks, nb => nb._id, nb => {
                return html`<li onclick="${selectNB.bind(this, nb)}">
                    ${nb.title}
                </li>`
            })}
        </div>`
    },
    animateAway: function() {
        this.classList.add('popup-out');
        setTimeout(() => {
            this.classList.remove('popup-out');
            this.remove();
        }, 400);
    }
})