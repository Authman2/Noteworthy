import Mosaic, { html } from 'mosaic-framework';

import * as Globals from '../util/Globals';
import * as Networking from '../util/Networking';

import imgSrc from '../images/LandingImage.png';
import '../styles/home.less';



export default Mosaic({
    name: 'signup-page',
    view: function() {
        return html`
        <img src='${imgSrc}' alt='People using Noteworthy!'>
        <h1>Noteworthy</h1>
        <p>A free, cross-platform, cloud-based note taking app!</p>

        <text-field id='create-fname-field' title="First Name"></text-field>
        <text-field id='create-lname-field' title="Last Name"></text-field>
        <text-field id='create-email-field' title="Email"></text-field>
        <text-field id='create-password-field' title="Password" type='password'></text-field>

        <round-button onclick='${this.actions.createAccount}'>Create Account</round-button>
        <round-button onclick='${this.actions.cancel}'>Cancel</round-button>
        `
    },
    actions: {
        async createAccount() {
            const firstNameField = document.getElementById('create-fname-field');
            const lastNameField = document.getElementById('create-lname-field');
            const emailField = document.getElementById('create-email-field');
            const passwordField = document.getElementById('create-password-field');

            const eVal = (emailField as any).getValue().toLowerCase();
            const pVal = (passwordField as any).getValue();
            const fVal = (firstNameField as any).getValue();
            const lVal = (lastNameField as any).getValue();            

            Globals.displayTextAlert('Creating account...', Globals.green);

            const res = await Networking.createAccount(eVal, fVal, lVal, pVal);
            if(res.ok === true) {
                Globals.displayTextAlert(`Created account!`, Globals.green);
                this.data.signUpMode = false;
            } else {
                Globals.displayTextAlert(res.error, Globals.red);
            }
        },
        cancel() {
            this.router.send('/');
        }
    }
});