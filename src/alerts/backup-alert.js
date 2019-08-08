import Mosaic from 'mosaic-framework';

import Globals from '../util/Globals';
import * as Networking from '../util/Networking';

import '../components/alert-button';

import '../styles/alerts.less';


export default new Mosaic({
    name: 'backup-alert',
    cancel() {
        const div = this.getElementsByClassName('modal-alert')[0];
        div.style.opacity = 0;
        setTimeout(() => {
            this.remove();
        }, 500);
        const drawer = document.getElementsByTagName('app-drawer')[0];
        if(drawer) drawer.style.transform = 'translateX(0%)';
    },
    async confirm() {
        
    },
    view() {
        return html`<div class='modal-alert'>
            <h1>Backup</h1>
            <p>Select a file location to </p>

            <alert-button color='gray' onclick='${this.cancel}'>CANCEL</alert-button>
            <alert-button color='#8F3936' onclick='${this.confirm}'>BACKUP</alert-button>
        </div>`
    }
})