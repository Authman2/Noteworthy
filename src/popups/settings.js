import Mosaic from 'mosaic-framework';

import '../components/round-button';

import Globals from '../util/Globals';
import * as Networking from '../util/Networking';
import * as Local from '../util/LocalData';


// Whether or not to show the login or create account view.
function renderLoginView(mode = false) {
    if(mode === false) {
        return html`<div>
            <h2>Login</h2>
            <input type='email' placeholder="Email"/>
            <input type='password' placeholder="Password"/>
        </div>`
    } else {
        return html`<div>
            <h2>Create Account</h2>
            <input type='text' placeholder="First Name"/>
            <input type='text' placeholder="Last Name"/>
            <input type='email' placeholder="Email"/>
            <input type='password' placeholder="Password"/>
        </div>`
    }
}

// Returns user information from the database if logged in.
async function getUserInfo(token) {
    if(token) {
        const res = await Networking.getUserInfo();
        if(res.ok === true) {
            // console.log(res.info);
            return {
                email: res.info.email,
                created: new Date(res.info.created).toDateString(),
                lastLogin: new Date(res.info.lastLogin).toDateString(),
            };
        } else {
            return {
                email: '------',
                created: '-------',
                lastLogin: '------'
            }
        }
    } else {
        return {
            email: '------',
            created: new Date().toDateString(),
            lastLogin: new Date().toDateString()
        }
    }
}


// Export the final component.
export default new Mosaic({
    name: 'settings-popup',
    element: 'popups',
    data: {
        signUpMode: false,
        userInfo: {
            email: '------',
            created: '-------',
            lastLogin: '--------'
        }
    },
    async handleLogin() {
        const emailField = this.getElementsByTagName('input')[0];
        const passwordField = this.getElementsByTagName('input')[1];
        
        const res = await Networking.login(emailField.value, passwordField.value);
        if(res.ok === true) {
            Globals.showActionAlert(res.message, Globals.ColorScheme.green);
            localStorage.setItem('noteworthy-token', res.token);
            
            // Get the user data.
            const token = localStorage.getItem('noteworthy-token');
            const userInfo = await getUserInfo(token);
            this.data.userInfo = userInfo;
        } else {
            Globals.showActionAlert(res.error, Globals.ColorScheme.red);
        }
    },
    async handleCreateAccount() {
        const firstNameField = this.getElementsByTagName('input')[0];
        const lastNameField = this.getElementsByTagName('input')[1];
        const emailField = this.getElementsByTagName('input')[2];
        const passwordField = this.getElementsByTagName('input')[3];
        
        const res = await Networking.createAccount(
            emailField.value, firstNameField.value, 
            lastNameField.value, passwordField.value
        );
        if(res.ok === true) {
            Globals.showActionAlert(`Created account!`, Globals.ColorScheme.green);
            this.data.signUpMode = false;
        } else {
            Globals.showActionAlert(res.error, Globals.ColorScheme.red);
        }
    },
    async handleBackup() {
        Globals.showActionAlert('Creating Noteworthy backup...', Globals.ColorScheme.blue, 0);
        let backup = {};

        // Get the notebooks and notes.
        let notebooks = await Local.getNotebooks();
        let notes = await Local.getAllNotes();
        notebooks.forEach(nb => backup[nb.id] = nb);
        notes.forEach(nt => backup[nt.id] = nt);
        
        // Native sharing.
        if('share' in window.navigator) {
            window.navigator.share({
                title: `Noteworthy_Backup_${Date.now()}`,
                text: JSON.stringify(backup),
                url: 'https://noteworthyapp.netlify.com'
            })
        } else {
            const data = JSON.stringify(backup);
            const uri = `data:application/octet-stream,${encodeURIComponent(data)}`;
            window.open(uri);
        }

        Globals.showActionAlert('Finished creating Noteworthy backup file!', Globals.ColorScheme.green, 4000);
    },
    async handleRestore() {
        const file = document.createElement('input');
        file.type = 'file';
        file.onchange = function(e) {
            const file = e.target.files[0];
            if(!file) {
                return Globals.showActionAlert('Could not load the backup file', Globals.ColorScheme.red, 4000);
            }

            const reader = new FileReader();
            reader.onload = async function(event) {
                const res = event.target.result;
                if(!res) {
                    return Globals.showActionAlert('Could not load the backup file', Globals.ColorScheme.red, 4000);
                }

                const toJSON = JSON.parse(res);
                const vals = Object.values(toJSON);
                Local.restore(vals);
            }
            reader.readAsText(file);
        }
        file.click();
    },
    async handleSync() {
        // const everything = {};
        // const nbs = await Local.getNotebooks();
        // const nts = await Local.getAllNotes();
        // nbs.forEach(async nb => everything[nb.id] = nb);
        // nts.forEach(async nt => everything[nt.id] = nt);

        // const result = await Networking.restore(nbs, nts);
        // if(result.ok === true) {
        //     Globals.showActionAlert('Saved all notes online!', Globals.ColorScheme.green);
        // } else {
        //     Globals.showActionAlert(result.error, Globals.ColorScheme.red);
        // }
    },
    view() {
        const token = localStorage.getItem('noteworthy-token');
        const { userInfo } = this.data;

        return html`
        ${ token ?
            html`<div>
                <h4>
                    <b>Email</b>: ${userInfo.email}
                </h4>
                <h4>
                    <b>Created</b>: ${userInfo.created}
                </h4>
                <h4>
                    <b>Last Login</b>: ${userInfo.lastLogin}
                </h4>
            </div>`
            :
            renderLoginView.bind(this, this.data.signUpMode)
        }

        ${ token ?
            html`<section>
                <round-button icon='ios-log-out' highlightColor='#707070' onclick='${this.handleRestore}'>
                    Save Online
                </round-button>
                <round-button icon='ios-log-out' highlightColor='#707070'
                    onclick='${async () => {
                        await Networking.logout();
                        this.data.userInfo = {
                            email: '------',
                            created: '-------',
                            lastLogin: '--------'
                        }
                        Globals.showActionAlert('Logged out!');
                    }}'>
                    Logout
                </round-button>
            </section>`
            :
            html`<section>
                <round-button highlightColor='#707070'
                    onclick='${() => {
                        if(this.data.signUpMode) this.handleCreateAccount();
                        else this.handleLogin();
                    }}'>
                    ${this.data.signUpMode ? "Create Account" : "Login"}
                </round-button>
                <round-button highlightColor='#707070'
                    onclick='${() => this.data.signUpMode = !this.data.signUpMode}'>
                    ${this.data.signUpMode ? "Cancel" : "Sign Up"}
                </round-button>
            </section>`
        }
        `
    },
    async created() {
        const token = localStorage.getItem('noteworthy-token');
        const userInfo = await getUserInfo(token);
        this.data.userInfo = userInfo;
    }
});

{/* <round-button icon='sync' highlightColor='#707070' onclick="${this.handleSync}">
                    Save Online
                </round-button>
                <round-button icon='sync' highlightColor='#707070' onclick="${this.handleBackup}">
                    Backup
                </round-button>
                <round-button icon='sync' highlightColor='#707070' onclick="${this.handleRestore}">
                    Restore
                </round-button> */}