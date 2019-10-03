import Mosaic from 'mosaic-framework';

import '../components/round-button';

import Globals from '../util/Globals';
import * as Networking from '../util/Networking';


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
    async handleBackup() {
        Globals.showActionAlert('Creating Noteworthy backup...', Globals.ColorScheme.blue, 0);
        let backup = {};

        // Get the notebooks and notes.
        let notebooks = await Local.getNotebooks();
        let notes = await Local.getAllNotes();
        notebooks.forEach(nb => backup[nb._id] = nb);
        notes.forEach(nt => backup[nt._id] = nt);
        
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
                const notebooks = vals.filter(obj => !obj.notebookID);
                const notes = vals.filter(obj => obj.notebookID);
                const result = await Networking.restore(notebooks, notes);
                Globals.showActionAlert(result.message, result.ok === true ? 
                    Globals.ColorScheme.green : Globals.ColorScheme.red);
            }
            reader.readAsText(file);
        }
        file.click();
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
                <round-button icon='ios-log-out' highlightColor='#707070' onclick='${this.handleBackup}'>
                    Backup to File
                </round-button>
                <round-button icon='ios-log-out' highlightColor='#707070' onclick='${this.handleRestore}'>
                    Restore
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
                        window.location.href = '/';
                    }}'>
                    Logout
                </round-button>
            </section>`
            :
            ''
        }
        `
    },
    async created() {
        const { ci } = this.data;
        if(ci) {
            const cib = document.getElementById(`ci-Settings`);
            this.style.top = `${cib.getBoundingClientRect().top - 150}px`;
        }

        const token = localStorage.getItem('noteworthy-token');
        if(token) {
            const userInfo = await getUserInfo(token);
            this.data.userInfo = userInfo;
        } else {
            window.location.href = '/';
        }
    },
    animateAway: function() {
        this.classList.add('popup-out');
        setTimeout(() => {
            this.classList.remove('popup-out');
            this.remove();
        }, 400);
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