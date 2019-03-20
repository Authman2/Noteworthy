const Mosaic = require('@authman2/mosaic').default;

const Globals = require('../other/Globals');
const portfolio = require('../portfolio');

const NotebookCell = new Mosaic({
    view() {
        let click = this.data.selectNotebook;
        let notebook = this.data.notebook || { pages: [] };
        return html`<div class='notebook-cell' onclick=${click}>
            <h2>Title: ${notebook.title}</h2>
            <h5>Notes: ${notebook.pages.length}</h5>
            <hr class='cell-separator'/>
        </div>`
    }
});

const NoteCell = new Mosaic({
    view() {
        let select = this.data.selectNote;
        let note = this.data.note || {};
        return html`<div class='notebook-cell' onclick=${select}>
            <h2>${note.title}</h2>
            <hr class='cell-separator'/>
        </div>`
    }
});

module.exports = new Mosaic({
    portfolio,
    data: {
        type: 'Notebook',
        items: []
    },
    actions: {
        close() { this.portfolio.dispatch('close-alert'); },
        selectNotebook(item) {
            if(this.data.type === 'Note') {
                this.portfolio.dispatch('select-note', { currentNote: item });
                document.getElementById('work-title-field').innerHTML = item.title;
                document.getElementById('work-content-field').innerHTML = item.content;
            } else {
                this.portfolio.dispatch('select-notebook', { currentNotebook: item });
            }

            this.actions.close.call(this);
            Globals.showActionAlert(`Opened the ${this.data.type.toLowerCase()} <b>${item.title}</b>`, Globals.ColorScheme.blue);
        }
    },
    view() {
        return html`<div class='popup'>
            <button class='close-btn' onclick='${this.actions.close}'><span class='fa fa-times'></span></button>

            <h1 class='popup-title'>${
                this.data.type === 'Notebook' ? 'My Notebooks' : this.portfolio.get('currentNotebook').title
            }</h1>
            <h4 class='popup-subtitle'>Select a ${this.data.type.toLowerCase()} to open:</h4>

            <div class='notebooks-view'>
                ${
                    this.data.items.length > 0 ? this.data.items.map((item, index) => {
                        if(this.data.type === 'Notebook') {
                            return NotebookCell.new({ notebook: item, selectNotebook: this.actions.selectNotebook.bind(this, item) });
                        } else {
                            return NoteCell.new({ note: item, selectNote: this.actions.selectNotebook.bind(this, item) })
                        }
                    }) : ''
                }
            </div>
        </div>`
    }
});