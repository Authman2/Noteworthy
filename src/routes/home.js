import Mosaic from 'mosaic-framework';

import Globals from '../util/Globals';
import * as Networking from '../util/Networking';

import '../styles/home.less';

async function getUserInfo(token) {
    if(token) return Globals.currentUser = {
        email: '-----',
        created: '-----',
        lastLogin: '-----'
    }

    const resp = await Networking.getUserInfo();
    if(!resp.ok) return Globals.currentUser = {
        email: '-----',
        created: '-----',
        lastLogin: '-----'
    }

    return Globals.currentUser = {
        email: res.info.email,
        created: new Date(res.info.created).toDateString(),
        lastLogin: new Date(res.info.lastLogin).toDateString(),
    }
}


export default new Mosaic({
    name: 'home-page',
    data: {
        signUpMode: true
    },
    fieldsView: function() {
        if(this.data.signUpMode === true)
            return html`<div>
                <text-field id='email-field' title="Email"></text-field>
                <text-field id='password-field' title="Password" type='password'></text-field>
            </div>`
        else
            return html`<div>
                <text-field id='create-fname-field' title="First Name"></text-field>
                <text-field id='create-lname-field' title="Last Name"></text-field>
                <text-field id='create-email-field' title="Email"></text-field>
                <text-field id='create-password-field' title="Password" type='password'></text-field>
            </div>`
    },
    view: function() {
        return html`
            <img src='' alt='People using Noteworthy!'>

            <h1>Noteworthy</h1>
            <p>A cross-platform, cloud-based note taking app!</p>

            <!-- The input fields. -->
            ${this.fieldsView.bind(this)}

            <!-- The navigation buttons. -->
            <round-button onclick='${
                this.data.signUpMode === true ? this.actions.login : this.actions.createAccount
            }'>
                ${this.data.signUpMode ? 'Login' : 'Create Account'}
            </round-button>
            <round-button onclick='${this.actions.toggleMode}'>
                ${this.data.signUpMode ? 'Sign Up' : 'Cancel'}
            </round-button>
        `
    },
    created: async function() {
        // Check if the user is already logged in
        // (i.e. has the token). In which case
        // just go to the next page.
        const token = localStorage.getItem('noteworthy-token');
        if(token) {
            const userInfo = await getUserInfo(token);
            this.data.userInfo = userInfo;
            this.router.send('/work');
        }
    },
    actions: {
        login: async function() {
            const emailField = document.getElementById('email-field');
            const passwordField = document.getElementById('password-field');
            
            // Make the api call.
            const resp = await Networking.login(emailField.getValue(), passwordField.getValue());
            Globals.showActionAlert(resp.message, resp.ok ? Globals.ColorScheme.green : Globals.ColorScheme.red);

            // Login and save the token to local storage.
            if(resp.ok) {
                localStorage.setItem('noteworthy-token', resp.token);
                this.router.send('/work');
            }
        },
        createAccount: async function() {
            const firstNameField = document.getElementById('create-fname-field');
            const lastNameField = document.getElementById('create-lname-field');
            const emailField = document.getElementById('create-email-field');
            const passwordField = document.getElementById('create-password-field');
            
            const res = await Networking.createAccount(
                emailField.getValue(), firstNameField.getValue(), 
                lastNameField.getValue(), passwordField.getValue()
            );
            if(res.ok === true) {
                Globals.showActionAlert(`Created account!`, Globals.ColorScheme.green);
                this.data.signUpMode = false;
            } else {
                Globals.showActionAlert(res.error, Globals.ColorScheme.red);
            }
        },
        toggleMode: async function() {
            this.data.signUpMode = !this.data.signUpMode;
        }
    }
});