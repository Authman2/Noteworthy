import Mosaic from '@authman2/mosaic';

import Globals from '../util/Globals';
import * as Networking from '../util/Networking';

import '../styles/work-page.less';


export default new Mosaic({
    name: 'work-page',
    
    view: self => html`
        <ion-icon name="menu"></ion-icon>

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
            if(e.keyCode !== 9) return;
            e.preventDefault();
            document.execCommand('insertHTML', false, '&#9;');
        });
    },
})