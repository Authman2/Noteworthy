import Mosaic from '@authman2/mosaic';
import turndown from 'turndown';

import Globals from '../util/Globals';
import * as Networking from '../util/Networking';
import portfolio from '../portfolio';


const tdService = new turndown();
tdService.addRule('', {
    filter: 'mark',
    replacement: function(content) {
        return `==${content}==`
    }
})
tdService.addRule('', {
    filter: 'u',
    replacement: function(content) {
        return `<u>${content}</u>`
    }
})
tdService.addRule('', {
    filter: 'strike',
    replacement: function(content) {
        return `~~${content}~~`
    }
})
tdService.addRule('', {
    filter: 'sub',
    replacement: function(content) {
        return `~${content}~`
    }
})
tdService.addRule('', {
    filter: 'sup',
    replacement: function(content) {
        return `^${content}^`
    }
})
tdService.addRule('', {
    filter: 'br',
    replacement: function(content) {
        return `<br>`;
    }
})
tdService.addRule('', {
    filter: 'span',
    replacement: function(content) {
        return `==${content}==`;
    }
})



export default new Mosaic({
    name: 'navigation-page',
    created() {
        this.class = 'drawer-page';
    },
    view() {
        return html`
            <!-- Notebooks -->
            <drawer-card color='#6792DD' onclick='${()=>portfolio.dispatch('go-to-notebooks')}'>
                <h3>Notebooks</h3>
                <p>View all of your notebooks, then select one to view the notes inside.</p>
            </drawer-card>

            <!-- Backup -->
            <drawer-card color='#84C594' onclick='${this.backupNotes.bind(this)}'>
                <h3>Backup Notes</h3>
                <p>Keep a local copy of your notebooks and notes.</p>
            </drawer-card>

            <!-- Restore -->
            <drawer-card color='#906FC2'>
                <h3>Restore Backup</h3>
                <p>
                    Use a Noteworthy backup file to restore all of your data from a
                    previous state.
                </p>
            </drawer-card>

            <!-- Settings -->
            <drawer-card color='#868686' onclick='${()=>portfolio.dispatch('go-to-settings')}'>
                <h3>Settings</h3>
                <p>Make changes to your app settings and view your account details.</p>
            </drawer-card>
        `
    },
    async backupNotes() {
        Globals.showActionAlert('Creating Noteworthy backup...', Globals.ColorScheme.blue, 0);
        let backup = {};

        // Get the notebooks.
        let nbResult = await Networking.loadNotebooks();
        if(!nbResult.ok) return;
        let notebooks = nbResult.notebooks;
        
        // Get the notes for each notebook.
        for(let i = 0; i < notebooks.length; i++) {
            const nb = notebooks[i];
            const nResults = await Networking.loadNotes(nb.id);
            if(!nResults.ok) continue;

            nResults.notes.notes.forEach(async note => {
                backup[note.id] = note;
            });
            backup[nb.id] = nb;
        }
        
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
    }
})