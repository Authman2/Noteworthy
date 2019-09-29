import Mosaic from 'mosaic-framework';

import ContextMenu from '../components/context-menu';

import '../styles/popups.less';
import '../styles/work.less';


export default new Mosaic({
    name: 'work-page',
    created: function() {
        ContextMenu.paint();
    },
    view: function() {
        return html`
        <div id='title-field' contenteditable="true">Title</div>
        <div id='note-field' contenteditable="true">Start typing here</div>
        `
    }
});