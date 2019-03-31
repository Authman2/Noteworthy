const Mosaic = require('@authman2/mosaic').default;
const PillButton = require('../components/pill-button');
const Globals = require('../other/Globals');
const portfolio = require('../portfolio');

const ResetPassword = require('../popups/reset-password');

module.exports = new Mosaic({
    portfolio,
    data: {
        loginTitle: 'Login',
        signupTitle: 'Sign Up',
        emailPlaceholder: 'Email',
        passwordPlaceholder: 'Password'
    },
    actions: {
        handleLogin() {
            if(this.data.loginTitle === 'Login') {
                let email = document.getElementById('email-field').value;
                let pass = document.getElementById('password-field').value;
                firebase.auth().signInWithEmailAndPassword(email, pass).then(user => {
                    this.parent.data.page = 1;
                }).catch(err => {
                    Globals.showActionAlert(`${err}`, Globals.ColorScheme.red);
                });
            } else {
                let email = document.getElementById('email-field').value;
                let pass = document.getElementById('password-field').value;
                firebase.auth().createUserWithEmailAndPassword(email, pass).then(user => {
                    this.parent.data.page = 1;
                }).catch(err => {
                    Globals.showActionAlert(`${err}`, Globals.ColorScheme.red);
                })
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
    view: function(data, actions) {
        return html`<div class='home'>
            <h1 class='page-title'>Noteworthy</h1>
            <input type='email' id='email-field' class='underline-field' placeholder='${data.emailPlaceholder}'>
            <input type='password' id='password-field' class='underline-field' placeholder='${data.passwordPlaceholder}'>
            <br>
            ${ PillButton.new({ title: data.loginTitle, click: actions.handleLogin.bind(this) }) }
            ${ PillButton.new({ title: data.signupTitle, click: actions.handleSignUp.bind(this) }) }

            <button class='forgot-password-button' onclick='${actions.handleForgotPassword}'>Forgot Password</button>
        </div>`
    }
});