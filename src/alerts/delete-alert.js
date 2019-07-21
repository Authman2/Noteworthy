import Mosaic from '@authman2/mosaic';

import '../components/alert-button';

import '../styles/alerts.less';


export default new Mosaic({
    name: 'delete-alert',
    cancel() {
        const div = this.getElementsByClassName('modal-alert')[0];
        div.style.opacity = 0;
        setTimeout(() => {
            this.remove();
        }, 500);
        const drawer = document.getElementsByTagName('app-drawer')[0];
        if(drawer) drawer.style.transform = 'translateX(0%)';
    },
    confirm() {
        alert("Confirming!");
    },
    view() {
        return html`<div class='modal-alert'>
            <h1>${this.data.title}</h1>
            <p>${this.data.subtitle}</p>

            <alert-button color='gray' onclick='${this.cancel}'>CANCEL</alert-button>
            <alert-button color='#8F3936' onclick='${this.confirm}'>DELETE</alert-button>
        </div>`
    }
})