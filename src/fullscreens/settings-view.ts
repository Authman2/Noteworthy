import Mosaic, { html } from 'mosaic-framework';

import '../components/round-button';

import * as Globals from '../util/Globals';
import * as Networking from '../util/Networking';


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
export default Mosaic({
    name: 'settings-view',
    element: 'fullscreens',
    data: {
        signUpMode: false,
        userInfo: {
            email: '------',
            created: '-------',
            lastLogin: '--------'
        }
    },
    async handleBackup() {
        Globals.displayTextAlert('Creating Noteworthy backup...', Globals.blue, 5000);
        let backup = {};

        // Get the notebooks and notes.
        let res1 = await Networking.loadNotebooks();
        if(res1.error)
            return Globals.displayTextAlert('Could not load notebooks', Globals.red);
        for(let i = 0; i < res1.notebooks.length; i++) {
            let nb = res1.notebooks[i];
            let res2 = await Networking.loadNotes(nb._id);
            
            backup[nb._id] = nb;
            res2.notes.forEach(nt => {
                backup[nt._id] = nt;
            });
        }
        
        if((navigator as any).share) {
            (navigator as any).share({
                title: `Noteworthy_Backup_${Date.now()}`,
                text: JSON.stringify(backup),
                url: 'https://noteworthyapp.netlify.com'
            });
        } else {
            const data = JSON.stringify(backup);
            const uri = `data:application/octet-stream,${encodeURIComponent(data)}`;
            window.open(uri);
        }

        Globals.displayTextAlert('Finished creating Noteworthy backup file!', Globals.green, 4000);
    },
    async handleRestore() {
        Globals.displayTextAlert('Restoring backup...', Globals.blue, 5000);

        const file = document.createElement('input');
        file.type = 'file';
        file.onchange = function(e) {
            const file = (e.target as any).files[0];
            if(!file) {
                return Globals.displayTextAlert('Could not load the backup file', Globals.red, 4000);
            }

            const reader = new FileReader();
            reader.onload = async function(event) {
                const res: string = event.target.result as string;
                if(!res) {
                    return Globals.displayTextAlert('Could not load the backup file', Globals.red, 4000);
                }

                const toJSON = JSON.parse(res);
                const vals = Object.values(toJSON);
                const notebooks = vals.filter((obj: any) => !obj.notebookID);
                const notes = vals.filter((obj: any) => obj.notebookID);
                const result = await Networking.restore(notebooks, notes);

                Globals.displayTextAlert(
                    result.message,
                    result.ok === true ? Globals.green : Globals.red,
                    4000
                );
            }
            reader.readAsText(file);
        }
        file.click();
    },
    view() {
        const { userInfo } = this.data;

        return html`
        <button class='close-button' onclick='${this.animateAway.bind(this)}'>
            <ion-icon name='close'></ion-icon>
        </button>
        <h1>Settings</h1>

        ${
            html`<div class='settings-info'>
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
        }

        ${ 
            html`<section>
                <round-button icon='ios-log-out' highlightColor='#707070' onclick='${this.handleBackup}'>
                    Backup to File
                </round-button>
                <round-button icon='ios-log-out' highlightColor='#707070' onclick='${this.handleRestore}'>
                    Restore from Backup
                </round-button>
                <round-button icon='ios-log-out' highlightColor='#707070' onclick='${async () => {
                    await Networking.logout();
                    this.data.userInfo = {
                        email: '------',
                        created: '-------',
                        lastLogin: '--------'
                    }
                    Globals.displayTextAlert('Logged out!', Globals.blue);
                    window.location.href = '/';
                }}'>
                    Logout
                </round-button>
            </section>`
        }
        `
    },
    async created() {
        const token = localStorage.getItem('noteworthy-token');
        if(token) {
            const userInfo = await getUserInfo(token);
            this.data.userInfo = userInfo;
        } else {
            window.location.href = '/';
        }
    },
    animateAway: function() {
        this.classList.add('fs-out');
        setTimeout(() => {
            this.classList.remove('fs-out');
            this.remove();
        }, 500);
    }
});