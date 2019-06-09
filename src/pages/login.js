import Mosaic from '@authman2/mosaic';

import Globals from '../util/Globals';
import Networking from '../util/Networking';
import PillButton from '../components/pill-button';
import ElectronMessages from '../util/ElectronMessages';
import { portfolio } from "../portfolio";

import '../styles/home.less';

export default new Mosaic({
    data: { signUpMode: false },
    async handleLogin(e) {
        if(e && e.keyCode && e.keyCode !== 13) return;

        if(!this.data.signUpMode) {
            let email = document.getElementById('email-field').value;
            let pass = document.getElementById('password-field').value;
            
            Globals.showActionAlert(`Logging in...`, Globals.ColorScheme.gray, 10000);

            const resp = await Networking.login(email, pass);
            if(resp.ok === true) this.router.send('/work');
            else Globals.showActionAlert(`${resp.err}`, Globals.ColorScheme.red);
        } else {
            let email = document.getElementById('email-field').value;
            let pass = document.getElementById('password-field').value;

            const resp = await Networking.createAccount(email, pass);
            if(resp.ok === true) this.router.send('/work');
            else Globals.showActionAlert(`${resp.err}`, Globals.ColorScheme.red);
        }
    },
    handleSignUp() {
        this.data.signUpMode = !this.data.signUpMode;
    },
    handleForgotPassword() {
        portfolio.dispatch('show-reset-password-alert');
    },
    async created() {
        ElectronMessages(this.router);
        
        // Load the current user.
        const cUser = localStorage.getItem('noteworthy-current-user');
        if(cUser) {
            const user = JSON.parse(cUser);
            Networking.currentUser = user;
            const result = await Networking.refreshUser();
            if(result.ok === true) return this.router.send('/work');
        }
    },
    view: self => html`<div class="home">
        <h1 class='page-title'>Noteworthy</h1>
        <input type='email'
            id='email-field'
            class='underline-field'
            placeholder='${self.data.signUpMode ? "Enter your email" : "Email"}'>
        <input type='password'
            id='password-field'
            class='underline-field'
            onkeypress='${self.handleLogin}'
            placeholder='${self.data.signUpMode ? "Create a password" : "Password"}'>
        <br>
        ${PillButton.new({
                title: self.data.signUpMode ? "Create Account" : "Login",
                click: self.handleLogin.bind(self)
        })}
        ${PillButton.new({
                title: self.data.signUpMode ? "Cancel" : "Create Account",
                click: self.handleSignUp.bind(self)
        })}

        <button class='forgot-password-button' onclick='${self.handleForgotPassword}'>
            Forgot Password
        </button>
    </div>`,
});