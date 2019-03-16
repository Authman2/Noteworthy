
import Globals from '../other/Globals';

/** A full screen alert that asks the user for information to make either a new notebook or new note. */
export default new Mosaic({
    data: {
        type: "Notebook"
    },
    actions: {
        toggleType() {
            this.data.type = this.data.type === 'Notebook' ? 'Note' : 'Notebook';
        },
        create: function() {
            if(this.data.type === 'Note') {
                if(!this.parent.data.currentNotebook) {
                    Globals.showActionAlert(`You must select a notebook before you can create a note.`, Globals.ColorScheme.red);
                    return;
                }
            }
            let field = document.getElementById('create-name-field');
            if(field.value.length < 1) {
                Globals.showActionAlert(`Please enter a name for this ${this.data.type.toLowerCase()}`, Globals.ColorScheme.red);
                return;
            }

            this.data.onCreate(this.data.type, field.value);
            if(this.parent) this.parent.actions.closeAlert();
        }
    },
    view() {
        return <div class='fullscreen-alert'>
            <button class='close-btn' onclick={this.actions.closeAlert}><span class='fa fa-times'/></button>

            <h1 class='fullscreen-alert-title'>Create New {this.data.type}</h1>
            <h4 class='fullscreen-alert-subtitle'>Enter a name for your new {this.data.type}</h4>

            <input class='underline-field' placeholder="Title" id='create-name-field' />
            <button class='fullscreen-alert-btn' onclick={this.actions.toggleType}>
                Switch to { this.data.type === 'Notebook' ? 'Note' : 'Notebook' }
            </button>

            <br/><br/><br/>
            <button class='fullscreen-alert-btn' onclick={this.actions.create}>Create { this.data.type }</button>
        </div>
    }
});
