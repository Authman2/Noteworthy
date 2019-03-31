const Mosaic = require('@authman2/mosaic').default;

const Globals = require('../other/Globals');
const portfolio = require('../portfolio');

module.exports = new Mosaic({
    portfolio,
    actions: {
        close() {
            this.portfolio.dispatch('close-alert');
        },
        resetWithoutAccount() {
            let field = document.getElementById('reset-email-field');
            let email = field.value;
            firebase.auth().sendPasswordResetEmail(email).then(val => {
                this.portfolio.dispatch('close-alert');
                Globals.showActionAlert(`Sent password reset email to ${email}!`, Globals.ColorScheme.gray);
            });
        }
    },
    view() {
        return html`<div class='popup'>
            <button class='close-btn' onclick='${this.actions.close}'><span class='fa fa-times'></span></button>

            <h1 class='popup-title'>Reset Password</h1>
            <p style='font-family:Avenir' id='account-alert-email'>Enter your Email:</p>
            <input type='email' placeholder="Email" id='reset-email-field'>
            <br><br>
            <button class='popup-btn' id='account-alert-reset' onclick='${this.actions.resetWithoutAccount}'>
                Send Password Reset Email
            </button>
            <br><br>
        </div>`
    }
});