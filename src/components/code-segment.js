import Mosaic from 'mosaic-framework';
import hljs from 'highlight.js';
import _ from 'underscore';

export default new Mosaic({
    name: 'code-segment',
    created() {
        this.hl();

        this.addEventListener('mouseover', this.disableEdits);
        this.addEventListener('mouseleave', this.enableEdits);
        // window.addEventListener('input', e => {
        //     if(!e.target || !e.target.classList.contains('code-segment'))
        //         return;

        //     _.debounce(this.hl.bind(this), 4000)();
        // })
    },
    disableEdits() {
        const content = document.getElementById('note-field');
        content.contentEditable = false;
    },
    enableEdits() {
        const content = document.getElementById('note-field');
        content.contentEditable = true;
    },
    hl() {
        hljs.highlightBlock(this.firstChild);
        console.log('Now highlighting!', this);
    },
    view() {
        return html`
        <div class='code-segment' contenteditable="true">var x = 5;</div>
        `
    }
})