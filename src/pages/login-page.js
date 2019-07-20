import Mosaic from '@authman2/mosaic';

import Globals from '../util/Globals';
import * as Networking from '../util/Networking';

import '../components/pill-button';
import '../components/underline-field';

import '../styles/login-page.less';


export default new Mosaic({
    name: 'login-page',
    data: { mode: 0 },
    async selectButtonOne() {
        if(this.data.mode === 0) {
            let fields = document.getElementsByClassName('field');
            let email = fields[0].firstChild.value;
            let pass = fields[1].firstChild.value;
            
            Globals.showActionAlert(`Logging in...`, Globals.ColorScheme.gray, 10000);

            const resp = await Networking.login(email, pass);
            if(resp.ok === true) {
                Globals.hideActionAlert();
                this.router.send('/work');
            } else Globals.showActionAlert(`${resp.error}`, Globals.ColorScheme.red);
        } else {
            let fields = document.getElementsByClassName('field');
            let email = fields[0].firstChild.value;
            let pass = fields[1].firstChild.value;

            const resp = await Networking.createAccount(email, pass);
            if(resp.ok === true) {
                Globals.hideActionAlert();
                this.router.send('/work');
            } else Globals.showActionAlert(`${resp.error}`, Globals.ColorScheme.red);
        }
    },
    selectButtonTwo() {
        this.data.mode = this.data.mode === 0 ? 1 : 0;
    },
    selectForgotPassword() {
        alert('Trying to recover password');
    },
    view() {
        const { mode } = this.data;

        return html`
        <h1>Noteworthy</h1>
        <br><br>

        <underline-field type='email' place='${mode === 0 ? "Email" : "Enter your email"}' class="field">
        </underline-field>
        <underline-field type='password' place='${mode === 0 ? "Password" : "Create a password"}' class="field">
        </underline-field>

        <pill-button click='${this.selectButtonOne.bind(this)}'>
            ${mode === 0 ? "Login" : "Create Account"}
        </pill-button>
        <pill-button click='${this.selectButtonTwo.bind(this)}'>
            ${mode === 0 ? "Sign Up" : "Cancel"}
        </pill-button>
        
        <h4 onclick='${this.selectForgotPassword}'>Forgot Password?</h4>
        `
    }
})