import Mosaic, { html } from 'mosaic-framework';
import '@polymer/paper-spinner/paper-spinner.js';

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
// export default Mosaic({
//     name: 'notebooks-view',
//     element: 'fullscreens',
//     portfolio: Portfolio,
//     useShadow: false,
//     data: {
//         notebooks: [],
//     },
//     created: async function() {
//         const res = await Networking.loadNotebooks();
//         if(res.ok) this.data.notebooks = res.notebooks;
//     },
//     view: function() {
//         const currentNB = this.portfolio.get('currentNotebook');

//         return html`
//             <h1>
//                 Current Notebook:
//                 <br>
//                 ${currentNB ? currentNB.title : "None"}
//             </h1>
//             ${this.showNotebooksList.bind(this)}
//         `
//     },
//     showNotebooksList: function() {
//         const selectNB = nb => {
//             this.portfolio.dispatch('select-notebook', {
//                 currentNotebook: nb
//             });
//             Globals.showActionAlert(
//                 `Opened the notebook ${nb.title}`,
//                 Globals.ColorScheme.blue
//             );
//             this.animateAway();
//         }
        
//         return html`<div id='notebooks-list-for-notebooks-popup'>
//             ${() => {
//                 if(this.data.notebooks.length === 0) {
//                     return html`<paper-spinner active></paper-spinner>`;
//                 } else {
//                     return html`<div>
//                         ${Mosaic.list(this.data.notebooks, nb => nb._id, nb => {
//                             return html`<div>
//                                 <li onclick="${selectNB.bind(this, nb)}">
//                                     ${nb.title}
//                                 </li>
//                                 <ion-icon name='close' onclick='${this.handleDelete.bind(this, nb)}'>
//                                 </ion-icon>
//                             </div>`
//                         })}
//                     </div>`
//                 }
//             }}
//         </div>`
//     },
//     handleDelete: function(nb) {
//         Globals.showActionAlert(
//             `Are you sure you want to delete "${nb.title}"? This will delete all notes inside of it as well.
//             <br>
//             <round-button id='delete-alert-button-yes' color='crimson'>Yes, delete</round-button>
//             <round-button id='delete-alert-button-no' color='gray'>No, cancel</round-button>`,
//             Globals.ColorScheme.gray,
//             0
//         );

//         const yesBtn = document.getElementById('delete-alert-button-yes');
//         const noBtn = document.getElementById('delete-alert-button-no');
//         yesBtn.onclick = async () => {
//             const resp = await Networking.deleteNotebook(nb._id);
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