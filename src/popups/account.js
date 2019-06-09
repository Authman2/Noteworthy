import Mosaic from '@authman2/mosaic';

import Globals from '../util/Globals';
import { portfolio } from '../portfolio';
import Networking from '../util/Networking';

export default new Mosaic({
    portfolio,
    element: '#overlay',
    close() { portfolio.dispatch('close-alert'); },
    async resetPassword() {
        let user = localStorage.getItem('noteworthy-current-user');
        if(!user) return;
        const cUser = JSON.parse(user);

        const result = await Networking.forgotPassword(cUser.email);
        if(result.ok) {
            portfolio.dispatch('close-alert');
            return Globals.showActionAlert(`Sent password reset email to ${cUser.email}!`, Globals.ColorScheme.gray);
        } else return Globals.showActionAlert(`${result.err}`, Globals.ColorScheme.red);
    },
    async logout() {
        const result = await Networking.logout();
        if(result.ok) {
            portfolio.dispatch('close-alert');
            if(this.data.router) this.data.router.send('/login');
            return Globals.showActionAlert('Logged out!', Globals.ColorScheme.gray);
        } else return Globals.showActionAlert(`Logout Error: ${err}`, Globals.ColorScheme.red);
    },
    view() {
        let user = localStorage.getItem('noteworthy-current-user');
        if(!user) return html`<div></div>`;
        let cUser = JSON.parse(user);

        return html`<div class='popup-backdrop'>
            <div class='popup'>
                <button class='close-btn' onclick='${this.close}'><span class='fa fa-times'></span></button>

                <h1 class='popup-title'>Account</h1>
                <p style='font-family:Avenir' id='account-alert-email'>
                    Email: ${ cUser ? cUser.email : 'Not Available' }
                </p>
                <br>
                <button class='rect-btn' id='account-alert-reset' onclick='${this.resetPassword}'>
                    Send Password Reset Email
                </button>
                <br>
                <button class='rect-btn' id='account-alert-logout' onclick='${this.logout}'>
                    Logout
                </button>
                <br><br>
            </div>
        </div>`
    }
});