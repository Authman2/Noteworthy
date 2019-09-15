import Mosaic from 'mosaic-framework';
import hljs from 'highlight.js';

export default new Mosaic({
    name: 'code-segment',
    data: {
        language: 'javascript'
    },
    created() {
        const node = this;
        hljs.highlightBlock(node);

        this.addEventListener('mouseover', this.disableEdits);
        this.addEventListener('mouseleave', this.enableEdits);
    },
    disableEdits() {
        const content = document.getElementById('note-field');
        content.contentEditable = false;
    },
    enableEdits() {
        const content = document.getElementById('note-field');
        content.contentEditable = true;
    },
    toggleDropdown() {
        const dropdown = document.getElementById("myDropdown");
        console.log(dropdown);
        //.classList.toggle("show");
    },
    selectLanguage(lang) {
        this.data.language = lang;
        document.getElementById("myDropdown").classList.toggle("show");
        console.log('Got here');
    },
    view() {
        return html`
        <section class="dropdown">
            <button onclick="${this.toggleDropdown}" class="code-segment-select-button">
                ${this.data.language}
            </button>
            <div id="myDropdown" class="dropdown-content">
                <option onclick='${this.selectLanguage.bind(this, 'javascript')}'>JavaScript</option>
                <option onclick='${this.selectLanguage.bind(this, 'typescript')}'>Typescript</option>
                <option onclick='${this.selectLanguage.bind(this, 'cpp')}'>C++</option>
            </div>
        </section>
        
        <div class='code-segment' contenteditable="true">var x = 5;</div>`
    }
})