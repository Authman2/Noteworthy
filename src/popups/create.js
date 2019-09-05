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
    
    await Networking.createNotebook(nameField.value);
    Globals.showActionAlert(`Created a new notebook called ${nameField.value}!`, Globals.ColorScheme.blue);
    nameField.value = '';
}

// Handles creating a note.
async function createNote() {
    const nameField = document.getElementById('create-name-field');    
    const regex = new RegExp(/^\s+$/);
    if(!nameField.value || regex.test(nameField.value)) {
        return Globals.showActionAlert('Please enter a name before creating a note', Globals.ColorScheme.red);
    }
    
    const titleField = document.getElementById('title-field');
    const contentField = document.getElementById('note-field');
    titleField.innerHTML = nameField.value;
    contentField.innerHTML = 'Start typing here...';
    Globals.showActionAlert(`Created a new notebook called ${nameField.value}!`, Globals.ColorScheme.blue);
    nameField.value = '';
}


// Export the main component.
export default new Mosaic({
    name: 'create-popup',
    element: 'popups',
    portfolio: Portfolio,
    view() {
        return html`
        <h2>Create</h2>
        <input id='create-name-field' type='text' placeholder="Name"/>

        <round-button icon='document' highlightColor='#707070' onclick='${createNote}'>
            Create Note
        </round-button>
        <round-button icon='ios-book' highlightColor='#707070' onclick='${createNotebook}'>
            Create Notebook
        </round-button>
        `
    }
});