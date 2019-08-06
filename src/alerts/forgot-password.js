import Mosaic from 'mosaic-framework';

import Globals from '../util/Globals';
import * as Networking from '../util/Networking';

import '../components/alert-button';
import '../components/underline-field';

import '../styles/alerts.less';


export default new Mosaic({
    name: 'forgot-password-alert',
    element: 'alerts',
    cancel() {
        const div = this.getElementsByClassName('modal-alert')[0];
        div.style.opacity = 0;
        setTimeout(() => {
            div.style.opacity = 1;
            this.remove();
        }, 500);
        const drawer = document.getElementsByTagName('app-drawer')[0];
        if(drawer) drawer.style.transform = 'translateX(0%)';
    },
    async confirm() {
        const email = document.getElementById('reset-pass-field').firstChild.value || '';
        const result = await Networking.forgotPassword(email);
        if(result.ok === true) {
            this.cancel();
            document.getElementById('reset-pass-field').firstChild.value = '';
            Globals.showActionAlert(`Sent a password reset email to <b>${email}</b>`, Globals.ColorScheme.blue, 4000);
        } else {
            Globals.showActionAlert(`${result.err}`, Globals.ColorScheme.red, 4000);
        }
    },
    view() {
        return html`<div class='modal-alert'>
            <h1>Forgot Password</h1>
            <p>Enter you email to send a reset link:</p>
            <underline-field type='email' place='Email' id='reset-pass-field'></underline-field>

            <alert-button color='gray' onclick='${this.cancel}'>CANCEL</alert-button>
            <alert-button color='#8F3936' onclick='${this.confirm}'>SEND RESET EMAIL</alert-button>
        </div>`
    }
})