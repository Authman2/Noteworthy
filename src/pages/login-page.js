import Mosaic from '@authman2/mosaic';

import Globals from '../util/Globals';
import * as Networking from '../util/Networking';

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
    async selectButtonOne() {
        if(this.data.mode === 0) {
            let fields = document.getElementsByClassName('field');
            let email = fields[0].firstChild.value;
            let pass = fields[1].firstChild.value;
            
            Globals.showActionAlert(`Logging in...`, Globals.ColorScheme.gray, 10000);

            const resp = await Networking.login(''+email, ''+pass);
            if(resp.ok === true) this.router.send('/work');
            else Globals.showActionAlert(`${resp.err}`, Globals.ColorScheme.red);
        } else {
            // Create Account.
            
        }
    },
    selectButtonTwo() {
        this.data.mode = this.data.mode === 0 ? 1 : 0;
    },
    conditional() {
        if(this.data.mode === 0) {
            return html`<div>
                <underline-field type='email' place='Email' class="field">
                </underline-field>
                <underline-field type='password' place='Password' class="field">
                </underline-field>
            </div>`
        } else {
            return html`<div>
                <underline-field type='email' place='Enter your email' class="field">
                </underline-field>
                <underline-field type='password' place='Create a password' class="field">
                </underline-field>
            </div>`
        }
    },
    conditional2() {
        if(this.data.mode === 0) {
            return html`<div>
                <pill-button title='Login'
                    click='${this.selectButtonOne.bind(this)}'></pill-button>
                <pill-button title='Sign Up'
                            click='${this.selectButtonTwo.bind(this)}'></pill-button>
            </div>`
        } else {
            return html`<div>
                <pill-button title='Create Account'
                    click='${this.selectButtonOne.bind(this)}'></pill-button>
                <pill-button title='Cancel'
                            click='${this.selectButtonTwo.bind(this)}'></pill-button>
            </div>`
        }
    },
    view() {
        return html`
        <h1>Noteworthy</h1>
        <br><br>

        ${this.conditional.bind(this)}
        ${this.conditional2.bind(this)}
        `
    }
})