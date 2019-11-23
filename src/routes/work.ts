import Mosaic, { html } from 'mosaic-framework';

import ContextMenu from '../components/context-menu';

import '../styles/fullscreens.less';
import '../styles/work.less';


export default Mosaic({
    name: 'work-page',
    created: function() {
        ContextMenu.paint();
    },
    willDestroy: function() {
        ContextMenu.remove();
    },
    view: function() {
        return html`
        <div id='title-field' contenteditable="true">Title</div>
        <div id='note-field' contenteditable="true">Start typing here</div>
        `
    }
});