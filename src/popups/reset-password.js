import Mosaic from '@authman2/mosaic';

import Globals from '../util/Globals';
import { portfolio } from '../portfolio';
import Networking from '../util/Networking';

export default new Mosaic({
    portfolio,
    element: '#overlay',
    close() { portfolio.dispatch('close-alert'); },
    async resetWithoutAccount() {
        let field = document.getElementById('reset-email-field');
        let email = field.value;

        const result = await Networking.forgotPassword(email);
        if(result.ok === true) {
            portfolio.dispatch('close-alert');
            Globals.showActionAlert(`Sent password reset email to ${email}!`, Globals.ColorScheme.gray);
        } else {
            Globals.showActionAlert(`There was a problem resetting your password.`, Globals.ColorScheme.red);
        }
    },
    view() {
        return html`<div class='popup-backdrop'>
            <div class='popup reset-popup'>
                <button class='close-btn' onclick='${this.close}'><span class='fa fa-times'></span></button>

                <h1 class='popup-title'>Reset Password</h1>
                <p style='font-family:Avenir' id='account-alert-email'>Enter your Email:</p>
                <input type='email'
                    placeholder="Email"
                    class='underline-field'
                    id='reset-email-field'
                    placeholder='Email'>
                <br><br>
                <button class='rect-btn' id='account-alert-reset' onclick='${this.resetWithoutAccount}'>
                    Send Password Reset Email
                </button>
                <br><br>
            </div>
        </div>`
    }
});