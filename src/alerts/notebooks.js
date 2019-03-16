
import Globals from "../other/Globals";

const NotebookCell = new Mosaic({
    view() {
        let click = this.data.selectNotebook;
        let notebook = this.data.notebook;
        return <div class='notebook-cell' onclick={() => click(this.parent, notebook)}>
            <h2>Title: {notebook.title}</h2>
            <h5>Notes: {notebook.pages.length}</h5>
            <hr class='cell-separator'/>
        </div>
    }
});

const NoteCell = new Mosaic({
    view() {
        let select = this.data.selectNote;
        let note = this.data.note;
        return <div class='notebook-cell' onclick={() => select(this.parent, note)}>
            <h2>Title: {note.title}</h2>
            <hr class='cell-separator'/>
        </div>
    }
});


export default new Mosaic({
    data: {
        type: 'Notebook',
        items: []
    },
    actions: {
        close: function() {
            if(this.parent) this.parent.actions.closeAlert();
        },
        selectNotebook: function(item) {
            if(this.data.type === 'Note') {
                if(this.parent) this.parent.data.currentNote = item;
                document.getElementById('work-content-field').innerHTML = item.content;
            }
            else if(this.parent) this.parent.data.currentNotebook = item;

            this.actions.closeAlert();
            Globals.showActionAlert(`Opened the notebook <b>${item.title}</b>`, Globals.ColorScheme.blue);
        }
    },
    view() {
        return <div class='fullscreen-alert'>
            <button class='close-btn' onclick={this.actions.close}><span class='fa fa-times'/></button>

            <h1 class='fullscreen-alert-title'>
                {
                    this.data.type === 'Notebook' ? 'My Notebooks' : this.parent.data.currentNotebook.title
                }
            </h1>
            <h4 class='fullscreen-alert-subtitle'>Select a {this.data.type.toLowerCase()} to open:</h4>

            <div class='notebooks-view'>
                {
                    this.data.items.length > 0 ? this.data.items.map((item, index) => {
                        if(this.data.type === 'Notebook') {
                            return <NotebookCell link={{ name: `cell_${index}`, parent: this }}
                                                notebook={item}
                                                selectNotebook={this.actions.selectNotebook.bind(this, item)} />
                        } else {
                            return <NoteCell link={{ name: `cell_${index}`, parent: this }}
                                            note={item}
                                            selectNote={this.actions.selectNotebook.bind(this, item)} />
                        }
                    }) : <div></div>
                }
            </div>
        </div>
    }
});