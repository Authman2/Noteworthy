import Mosaic from '@authman2/mosaic';

import portfolio from '../portfolio';


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
            <drawer-card color='#84C594'>
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
            <drawer-card color='#868686'>
                <h3>Settings</h3>
                <p>Make changes to your app settings and view your account details.</p>
            </drawer-card>
        `
    }
})