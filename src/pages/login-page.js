import Mosaic from '@authman2/mosaic';

import '../components/pill-button';
import '../components/underline-field';

import '../styles/login-page.less';


export default new Mosaic({
    name: 'login-page',
    data: {
        mode: 0,
        emailPlaceholder: 'Email',
        passPlaceholder: 'Password',
        buttonOneTitle: 'Login',
        buttonTwoTitle: 'Sign Up',
    },
    selectButtonOne() {

    },
    selectButtonTwo() {
        console.log(this);
    },
    view() {
        const { mode } = this.data;
        return html`
        <h1>Noteworthy</h1>
        <br><br>
        <underline-field type='email' place='${mode === 0 ? "Email" : "Enter your email"}'>
        </underline-field>
        <underline-field type='password' place='${mode === 0 ? "Password" : "Create a password"}'>
        </underline-field>

        <pill-button title='${mode === 0 ? "Login" : "Create Account"}'
                    click='${this.selectButtonOne}'></pill-button>
        <pill-button title='${mode === 0 ? "Sign Up" : "Cancel"}'
                    click='${this.selectButtonTwo}'></pill-button>
        `
    }
})