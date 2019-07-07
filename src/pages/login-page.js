import Mosaic from '@authman2/mosaic';

import '../components/pill-button';

import '../styles/login-page.less';


export default new Mosaic({
    name: 'login-page',
    view() {
        return html`
        <h1>Noteworthy</h1>
        <input type='email' placeholder='Email'>
        <input type='password' placeholder='Password'>

        <pill-button title='Login'></pill-button>
        <pill-button title='Sign Up'></pill-button>
        `
    }
})