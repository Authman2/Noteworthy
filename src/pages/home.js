import { Mosaic } from '@authman2/mosaic';
import firebase from 'firebase';

import PillButton from '../components/pillButton';

export default new Mosaic({
    data: {
        loginPlaceholder: 'Email',
        signupPlaceholder: 'Password',
        loginTitle: 'Login',
        signUpTitle: 'Sign Up'
    },
    actions: {
        handleLogin: function() {
            if(this.data.loginTitle === 'Login') {
                let email = document.getElementById('login-field').value;
                let pass = document.getElementById('signup-field').value;
                
                firebase.auth().signInWithEmailAndPassword(email, pass).catch((err) => {
                    alert('Error: ' + err);
                })
            } else {
                let email = document.getElementById('login-field').value;
                let pass = document.getElementById('signup-field').value;
                
                firebase.auth().createUserWithEmailAndPassword(email, pass).catch((err) => {
                    alert('Error creating account: ' + err);
                });
            }
        },
        handleSignUp: function() {
            if(this.data.signUpTitle === 'Cancel') {
                this.data.loginPlaceholder = 'Email';
                this.data.signupPlaceholder = 'Password';
                
                this.data.loginTitle = 'Login';
                this.data.signUpTitle = 'Sign Up';
            } else {
                this.data.loginPlaceholder = 'Enter your email';
                this.data.signupPlaceholder = 'Createa a 6-character password';
                
                this.data.loginTitle = 'Create Account';
                this.data.signUpTitle = 'Cancel';
            }
        }
    },
    view: function() {
        return <div class='home'>
            <h1 class='title'>Noteworthy</h1>
            <div class='home-login-fields'>
                <input class='underline-field' placeholder={this.data.loginPlaceholder} id='login-field' />
                <input type='password' class='underline-field' id='signup-field' placeholder={this.data.signupPlaceholder} />

                <PillButton link={{ name: 'loginBtn', parent: this }} onclick={this.actions.handleLogin}>
                    { this.data.loginTitle }
                </PillButton>
                <PillButton link={{ name: 'signUpBtn', parent: this }} onclick={this.actions.handleSignUp}>
                    { this.data.signUpTitle }
                </PillButton>
            </div>
        </div>
    },
    created() {
        this.data.loginPlaceholder = 'Email';
    }
});