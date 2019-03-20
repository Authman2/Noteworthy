const Mosaic = require('@authman2/mosaic').default;

const Globals = require('../other/Globals');
const portfolio = require('../portfolio');

module.exports = new Mosaic({
    portfolio,
    actions: {
        close() {
            this.portfolio.dispatch('close-alert');
        },
        share() {
            
        }
    },
    view() {
        return html`<div class='popup'>
            <button class='close-btn' onclick='${this.actions.close}'><span class='fa fa-times'></span></button>

            <h1 class='popup-title'>Share</h1>
            <input class='underline-field' placeholder="Receiver Email" id='receiver-email-field'>
            <input class='underline-field' placeholder="Sender Email" id='sender-email-field'>
            <input class='underline-field' placeholder="Sender Password" id='sender-password-field'>

            <button class='popup-btn' onclick='${this.actions.share}'>Share!</button>
            <br>
        </div>`
    }
});