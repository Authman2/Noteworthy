import Mosaic from 'mosaic-framework';

import '../components/round-button';

import * as Networking from '../util/Networking';
import Globals from '../util/Globals';
import Portfolio from '../util/Portfolio';



// Handles creating a notebook.
async function createNotebook() {
    const nameField = document.getElementById('create-name-field');
    
    const regex = new RegExp(/^\s+$/);
    if(!nameField.value || regex.test(nameField.value)) {
        return Globals.showActionAlert('Please enter a name before creating a notebook', Globals.ColorScheme.red);
    }
    
    const res = await Networking.createNotebook(nameField.value);
    Globals.showActionAlert(res.message, res.ok ? Globals.ColorScheme.blue : Globals.ColorScheme.red);
    nameField.value = '';

    // Close the dropdown.
    const newDropdown = document.getElementById('new-dropdown');
    if(newDropdown) await newDropdown.toggleDropdown();

    // Reload the sidebar so it has the new data.
    const sidebar = document.getElementsByTagName('side-bar')[0];
    if(sidebar) {
        sidebar.data.notebooks = [];
        await sidebar.loadNotes.call(sidebar);
    }
}

// Handles creating a note.
async function createNote() {
    const nb = this.data.selectedNB;
    if(!nb) {
        return Globals.showActionAlert('Please select the notebook that you would like to create this note in', Globals.ColorScheme.red);
    }

    const nameField = document.getElementById('create-name-field');    
    const regex = new RegExp(/^\s+$/);
    if(!nameField.value || regex.test(nameField.value)) {
        return Globals.showActionAlert('Please enter a name before creating a note', Globals.ColorScheme.red);
    }

    // Create a new note in the database.
    const res = await Networking.createNote(nameField.value || "", 'Start typing here', nb._id);
    if(res.ok === true) {
        // Set the current note to the one you just created.
        const titleField = document.getElementById('title-field');
        const contentField = document.getElementById('note-field');
        titleField.innerHTML = nameField.value;
        contentField.innerHTML = 'Start typing here...';

        // Display results.
        Globals.showActionAlert(res.message, Globals.ColorScheme.blue);
        nameField.value = '';
        this.data.selectedNB = null;

        // Close the dropdown.
        const newDropdown = document.getElementById('new-dropdown');
        if(newDropdown) await newDropdown.toggleDropdown();

        // Reload the sidebar.
        const sidebar = document.getElementsByTagName('side-bar')[0];
        if(sidebar) {
            sidebar.data.notebooks = [];
            await sidebar.loadNotes.call(sidebar);
        }
    } else {
        return Globals.showActionAlert(res.message, Globals.ColorScheme.red);
    }
}


// Export the main component.
export default new Mosaic({
    name: 'create-popup',
    element: 'popups',
    portfolio: Portfolio,
    data: {
        notebooks: [],
        selectedNB: null
    },
    async created() {
        const res = await Networking.loadNotebooks();
        if(!res.ok) return;

        this.data.notebooks = res.notebooks;
    },
    view() {
        return html`
        <h2>Create</h2>
        <p>If creating a note, select which notebook you want to place it in:</p>
        <input id='create-name-field' type='text' placeholder="Name"/>
        ${Mosaic.list(this.data.notebooks, nb => nb._id, nb => {
            const cnb = this.data.selectedNB;
            return html`<button class='select-notebook-btn' onclick='${() => {
                this.data.selectedNB = nb;
                this.repaint();
            }}' style='${cnb && cnb._id === nb._id ? 'background-color: rgb(181, 202, 241)' : 'background-color: cornflowerblue'}'>
                ${nb.title}
            </button>`
        })}
        <br><br>

        <round-button icon='document' highlightColor='#707070' onclick='${createNote.bind(this)}'>
            Create Note
        </round-button>
        <round-button icon='ios-book' highlightColor='#707070' onclick='${createNotebook}'>
            Create Notebook
        </round-button>
        `
    }
});