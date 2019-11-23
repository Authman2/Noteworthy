import Mosaic, { html } from 'mosaic-framework';

import * as Globals from '../util/Globals';
import * as Networking from '../util/Networking';

import '../styles/home.less';

export default Mosaic({
    name: 'home-page',
    created: function() {
        const token = localStorage.getItem('noteworthy-token');
        if(token) this.router.send('/work');
    },
    view: function() {
        return html`
        <img src='' alt='People using Noteworthy!'>
        <h1>Noteworthy</h1>
        <p>A free, cross-platform, cloud-based note taking app!</p>

        <text-field id='email-field' title="Email" type='email'></text-field>
        <text-field id='password-field' title="Password" type='password'></text-field>

        <round-button onclick='${this.actions.login}'
            onkeydown="${e => e.keyCode === 13 && this.actions.login()}">Login</round-button>
        <round-button onclick='${this.actions.signUp}'>Sign Up</round-button>
        `
    },
    actions: {
        async login() {
            const emailField = document.getElementById('email-field');
            const passwordField = document.getElementById('password-field');

            const eVal = (emailField as any).getValue().toLowerCase();
            const pVal = (passwordField as any).getValue();
            
            // Make the api call.
            const resp = await Networking.login(eVal, pVal);
            Globals.displayTextAlert(resp.message, resp.ok ? Globals.green : Globals.red);

            // Login and save the token to local storage.
            if(resp.ok) {
                localStorage.setItem('noteworthy-token', resp.token);
                this.router.send('/work');
            }
        },
        signUp() {
            this.router.send('/signup');
        }
    }
});