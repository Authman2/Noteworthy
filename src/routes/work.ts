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
        <div id='note-field' contenteditable="true"
            onkeydown="${this.updateSelectionPoint}"
            onmousedown="${this.updateSelectionPoint}">Start typing here</div>
        `
    },
    updateSelectionPoint: function(e) {
        const sel = window.getSelection();
        console.log(sel);
    }
});