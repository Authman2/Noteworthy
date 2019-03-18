const Mosaic = require('@authman2/mosaic').default;
const PillButton = require('../components/pill-button');

module.exports = new Mosaic({
    data: {
        loginTitle: 'Login',
        signupTitle: 'Sign Up',
        emailPlaceholder: 'Email',
        passwordPlaceholder: 'Password'
    },
    actions: {
        handleLogin() {

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
        }
    },
    view: function(data, actions) {
        return html`<div class='home'>
            <h1 class='page-title'>Noteworthy</h1>
            <input type='email' id='email-field' class='underline-field' placeholder='${data.emailPlaceholder}'>
            <input type='email' id='password-field' class='underline-field' placeholder='${data.passwordPlaceholder}'>
            <br>
            ${ PillButton.new({ title: data.loginTitle, click: actions.handleLogin.bind(this) }) }
            ${ PillButton.new({ title: data.signupTitle, click: actions.handleSignUp.bind(this) }) }
        </div>`
    }
});