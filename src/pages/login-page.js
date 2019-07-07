import Mosaic from '@authman2/mosaic';

import '../components/pill-button';
import '../components/underline-field';

import '../styles/login-page.less';


export default new Mosaic({
    name: 'login-page',
    view() {
        return html`
        <h1>Noteworthy</h1>
        <br><br>
        <underline-field type='email' place='Email'></underline-field>
        <underline-field type='password' place='Password'></underline-field>

        <pill-button title='Login'></pill-button>
        <pill-button title='Sign Up'></pill-button>
        `
    }
})