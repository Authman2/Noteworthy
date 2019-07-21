import Mosaic from '@authman2/mosaic';

import Globals from '../util/Globals';
import * as Networking from '../util/Networking';

import '../components/alert-button';

import '../styles/alerts.less';


export default new Mosaic({
    name: 'move-alert',
    data: {
        notebooks: []
    },
    cancel() {
        const div = this.getElementsByClassName('modal-alert')[0];
        div.style.opacity = 0;
        setTimeout(() => {
            this.remove();
        }, 500);
        const drawer = document.getElementsByTagName('app-drawer')[0];
        if(drawer) drawer.style.transform = 'translateX(0%)';
    },
    confirm(notebook) {
        alert("Confirming!" + notebook.title);
    },
    async created() {
        const result = await Networking.loadNotebooks();
        if(result.ok === true) this.data.notebooks = result.notebooks;
        else
            Globals.showActionAlert('Noteworthy could not load your notebooks. Try again later!', Globals.ColorScheme.red);
    },
    view() {
        return html`<div class='modal-alert'>
            <h1>${this.data.title}</h1>
            <p>${this.data.subtitle}</p>

            ${this.data.notebooks.map(notebook => {
                return html`<div class='move-cell' onclick='${this.confirm.bind(null, notebook)}'>
                    ${notebook.title}
                </div>`
            })}

            <alert-button color='gray' onclick='${this.cancel}'>CANCEL</alert-button>
        </div>`
    }
})