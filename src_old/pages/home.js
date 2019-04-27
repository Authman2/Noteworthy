import Mosaic from '@authman2/mosaic';
import PillButton from '../components/pill-button';

import Globals from '../other/Globals';
import portfolio from '../portfolio';
import Networking from '../other/Networking';

import ResetPassword from '../popups/reset-password';

export default new Mosaic({
    portfolio,
    data: {
        loginTitle: 'Login',
        signupTitle: 'Sign Up',
        emailPlaceholder: 'Email',
        passwordPlaceholder: 'Password'
    },
    actions: {
        async handleLogin() {
            if(this.data.loginTitle === 'Login') {
                let email = document.getElementById('email-field').value;
                let pass = document.getElementById('password-field').value;
                
                try {
                    await Networking.login(email, pass);
                    this.parent.data.page = 1;
                } catch(err) {
                    Globals.showActionAlert(`${err}`, Globals.ColorScheme.red);
                }
            } else {
                let email = document.getElementById('email-field').value;
                let pass = document.getElementById('password-field').value;

                // firebase.auth().createUserWithEmailAndPassword(email, pass).then(user => {
                //     this.parent.data.page = 1;
                // }).catch(err => {
                //     Globals.showActionAlert(`${err}`, Globals.ColorScheme.red);
                // })
            }
        },
        handleSignUp() {
            if(this.data.loginTitle === 'Login') {
                this.data.loginTitle = 'Create Account';
                this.data.signupTitle = 'Cancel';
                this.data.emailPlaceholder = 'Enter your email';
                this.data.passwordPlaceholder = 'Create a password';
            } else {
                this.data.loginTitle = 'Login';
                this.data.signupTitle = 'Sign Up';
                this.data.emailPlaceholder = 'Email';
                this.data.passwordPlaceholder = 'Password';
            }
        },
        handleForgotPassword() {
            this.portfolio.dispatch('show-alert', { alert: ResetPassword.new() });
        }
    },
    view: self => html`<div class='home'>
        <h1 class='page-title'>Noteworthy</h1>
        <input type='email' id='email-field' class='underline-field' placeholder='${self.data.emailPlaceholder}'>
        <input type='password' id='password-field' class='underline-field' placeholder='${self.data.passwordPlaceholder}'>
        <br>
        ${ PillButton.new({ title: self.data.loginTitle, click: self.actions.handleLogin.bind(self) }) }
        ${ PillButton.new({ title: self.data.signupTitle, click: self.actions.handleSignUp.bind(self) }) }

        <button class='forgot-password-button' onclick='${self.actions.handleForgotPassword}'>Forgot Password</button>
    </div>`
});