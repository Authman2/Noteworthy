import Mosaic from '@authman2/mosaic';

import ContextMenu from '../components/context-menu';
import { portfolio } from '../portfolio';

import Globals from '../util/Globals';
import Networking from '../util/Networking';
import ElectronMessages from '../util/ElectronMessages';

import '../styles/context-menu.less';
import '../styles/work.less';

ElectronMessages();

export default new Mosaic({
    created() {
        // Load the notebooks and notes.
        const cUser = localStorage.getItem('noteworthy-current-user');
        if(!cUser) return this.router.send('/login');
        else { Networking.currentUser = JSON.parse(cUser); }
    },
    view: self => html`<div class='work'>
        ${ ContextMenu.new({ router: self.router }) }

        <div id='work-title-field' contenteditable='true'>Title</div>
        <div id='work-content-field' contenteditable='true'>Note</div>
    </div>`
});