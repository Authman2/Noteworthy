import Mosaic from '@authman2/mosaic';

import ContextMenu from '../components/context-menu';
import { portfolio } from '../portfolio';

import Globals from '../util/Globals';
import Networking from '../util/Networking';
import ElectronMessages from '../util/ElectronMessages';

import '../styles/context-menu.less';
import '../styles/work.less';

export default new Mosaic({
    async created() {
        ElectronMessages(this.router);
        const cUser = localStorage.getItem('noteworthy-current-user');
        if(cUser) {
            Networking.currentUser = JSON.parse(cUser);
            Globals.showActionAlert(`Welcome <b>${Networking.currentUser.email}</b>!`, Globals.ColorScheme.blue);
        } else {
            this.router.send('/login');
        }

        // Add an event listener for tabs.
        document.getElementById('work-content-field').addEventListener('keydown', e => {
            if(e.keyCode !== 9) return;
            e.preventDefault();
            document.execCommand('insertHTML', false, '&#9;');
        });
    },
    view: self => html`<div class='work'>
        ${ ContextMenu.new({ router: self.router }) }

        <div id='work-title-field' contenteditable='true' tabindex="-1">Title</div>
        <div id='work-content-field' contenteditable='true' tabindex="-1">Note</div>
    </div>`
});