import Mosaic from '@authman2/mosaic';

import ContextMenu from '../components/context-menu';

import Globals from '../util/Globals';
import Networking from '../util/Networking';

import '../styles/context-menu.less';
import '../styles/work.less';


export default new Mosaic({
    view: self => html`<div>
        ${ ContextMenu.new() }

        <div id='work-title-field' contenteditable='true'>Title</div>
        <div id='work-content-field' contenteditable='true'>Note</div>
    </div>`
});