import Mosaic from '@authman2/mosaic';

import Globals from '../util/Globals';
import * as Networking from '../util/Networking';
import portfolio from '../portfolio';

import '../components/rect-button';

import '../styles/settings-page.less';


export default new Mosaic({
    name: 'settings-page',
    created() {
        this.class = 'drawer-page';
    },
    view() {
        return html`
            <h2>Account Information</h2>
            <h3><b>Email:</b> authman2@gmail.com</h3>
            <h3><b>Created Account:</b> May 7, 2019</h3>
            <h3><b>Last Logged In:</b> June 15, 2019</h3>

            <br>
            <rect-button color='gray'>Sign Out</rect-button>
            <br>

            <h2>Saving</h2>
            <p>
                Every note is autosaved in the background as you work,
                however, you can click here to save your note manually
                if it makes you more comfortable :)
            </p>
            <rect-button color='#73BE4D' click='${this.saveCurrentNote}'>Save!</rect-button>
        `
    },
    async saveCurrentNote() {
        const note = portfolio.get('currentNote');
        if(!note)
            return Globals.showActionAlert(`You must have a note open before you can save anything!`, Globals.ColorScheme.red, 3000);

        Globals.showActionAlert('Saving...');
        const title = document.getElementById('title-field').innerText;
        const content = document.getElementById('content-field').innerHTML;

        const result = await Networking.save(note.id, title, content);
        if(result.ok) Globals.showActionAlert(`Saved!`, Globals.ColorScheme.green);
        else {
            if(resp.err.includes('No current user')) Globals.showRefreshUserAlert();
            else Global.showActionAlert(result.err, Globals.ColorScheme.red);
        }
    }
})