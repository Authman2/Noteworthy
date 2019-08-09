import Mosaic from 'mosaic-framework';

import AppDrawer from '../components/app-drawer';
import AppTools from '../components/app-tools';

import Globals from '../util/Globals';
import * as Networking from '../util/Networking';
import portfolio from '../portfolio';

import '../styles/work-page.less';


export default new Mosaic({
    name: 'work-page',
    
    view: self => html`
        <div id='top-bar'></div>
        <ion-icon name="menu" onclick='${self.openDrawer}'></ion-icon>

        <div id='title-field' contenteditable='true' tabindex='-1'>Title</div>
        <div id='content-field' contenteditable='true' tabindex='-1'>Start typing!</div>
    `,

    async created() {
        // Present a message to the current user.
        const cUser = localStorage.getItem('noteworthy-current-user');
        if(cUser) {
            Networking.currentUser = JSON.parse(cUser);
            Globals.showActionAlert(`Welcome <b>${Networking.currentUser.email}</b>!`, Globals.ColorScheme.blue);
        } else this.router.send('/login');

        // Clicking "tab" will add a tab space.
        document.getElementById('content-field').addEventListener('keydown', e => {
            // Save the note after some interval of characters.
            if(portfolio.get('currentNote')) {
                if(Globals.typeCount > 0) Globals.typeCount -= 1;
                else {
                    this.saveCurrentNote();
                    Globals.typeCount = 20;
                }
            }

            if(e.keyCode !== 9) return;
            e.preventDefault();
            document.execCommand('insertHTML', false, '&#9;');
        });

        // Setup the tools.
        if(window.matchMedia('(min-width: 768px)')) {
            AppTools.paint();
        }
    },

    openDrawer() {
        AppDrawer.paint();
        AppDrawer.router = this.router;
        const overlay = document.getElementById('overlay');
        if(overlay) {
            overlay.style.opacity = 1;
            overlay.style.zIndex = 99;
        }
    },

    async saveCurrentNote() {
        const note = portfolio.get('currentNote');
        const title = document.getElementById('title-field').innerText;
        const content = document.getElementById('content-field').innerHTML;
        await Networking.save(note.id, title, content);
    }
})