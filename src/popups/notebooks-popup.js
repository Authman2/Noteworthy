import Mosaic from 'mosaic-framework';
import '@polymer/paper-spinner/paper-spinner.js';

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
            ${() => {
                if(this.data.notebooks.length === 0) {
                    return html`<paper-spinner active></paper-spinner>`;
                } else {
                    return html`<div>
                        ${Mosaic.list(this.data.notebooks, nb => nb._id, nb => {
                            return html`<div>
                                <li onclick="${selectNB.bind(this, nb)}">
                                    ${nb.title}
                                </li>
                                <ion-icon name='close' onclick='${this.handleDelete.bind(this, nb)}'>
                                </ion-icon>
                            </div>`
                        })}
                    </div>`
                }
            }}
        </div>`
    },
    handleDelete: function(nb) {
        Globals.showActionAlert(
            `Are you sure you want to delete "${nb.title}"? This will delete all notes inside of it as well.
            <br>
            <round-button id='delete-alert-button-yes' color='crimson'>Yes, delete</round-button>
            <round-button id='delete-alert-button-no' color='gray'>No, cancel</round-button>`,
            Globals.ColorScheme.gray,
            0
        );

        const yesBtn = document.getElementById('delete-alert-button-yes');
        const noBtn = document.getElementById('delete-alert-button-no');
        yesBtn.onclick = async () => {
            const resp = await Networking.deleteNotebook(nb._id);
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