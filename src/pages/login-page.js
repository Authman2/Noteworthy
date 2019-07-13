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
        this.mode = this.mode === 0 ? 1 : 0;
    },
    conditional() {
        if(this.mode === 0) {
            return html`<div>
                <underline-field type='email' place='Email'>
                </underline-field>
                <underline-field type='password' place='Password'>
                </underline-field>
            </div>`
        } else {
            return html`<div>
                <underline-field type='email' place='Enter your email'>
                </underline-field>
                <underline-field type='password' place='Create a password'>
                </underline-field>
            </div>`
        }
    },
    view() {
        return html`
        <h1>Noteworthy</h1>
        <br><br>

        ${this.conditional.bind(this)}

        <pill-button title='${this.mode === 0 ? "Login" : "Create Account"}'
                    click='${this.selectButtonOne.bind(this)}'></pill-button>
        <pill-button title='${this.mode === 0 ? "Sign Up" : "Cancel"}'
                    click='${this.selectButtonTwo.bind(this)}'></pill-button>
        `
    }
})