const Mosaic = require('@authman2/mosaic').default;

const Globals = require('../other/Globals');
const portfolio = require('../portfolio');

module.exports = new Mosaic({
    portfolio,
    actions: {
        close() {
            this.portfolio.dispatch('close-alert');
        },
        resetPassword() {
            let user = firebase.auth().currentUser;
            if(!user) return;

            firebase.auth().sendPasswordResetEmail(user.email).then(val => {
                Globals.showActionAlert(`Sent password reset email to ${user.email}!`, Globals.ColorScheme.gray);
            })
        },
        logout() {
            firebase.auth().signOut().then(() => {
                this.portfolio.dispatch('close-alert');
                Globals.showActionAlert('Logged out!', Globals.ColorScheme.gray);
            }).catch((err) => {
                Globals.showActionAlert(`Logout Error: ${err}`, Globals.ColorScheme.red);
            });
        }
    },
    view() {
        let user = firebase.auth().currentUser;
        return html`<div class='popup'>
            <button class='close-btn' onclick='${this.actions.close}'><span class='fa fa-times'></span></button>

            <h1 class='popup-title'>Account</h1>
            <p style='font-family:Avenir' id='account-alert-email'>Email: ${ user ? user.email : 'Not Available' }</p>
            <br>
            <button class='popup-btn' id='account-alert-reset' onclick='${this.actions.resetPassword}'>
                Send Password Reset Email
            </button>
            <br>
            <button class='popup-btn' id='account-alert-logout' onclick='${this.actions.logout}'>
                Logout
            </button>
            <br><br>
        </div>`
    }
});