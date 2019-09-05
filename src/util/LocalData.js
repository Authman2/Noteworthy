import Dexie from 'dexie';

import Globals from './Globals';
import { loadNotes } from './Networking';


// Setup the notebooks and notes databases.
let localNotebooks = new Dexie('Noteworthy-notebooks');
let localNotes = new Dexie('Noteworthy-notes');

localNotebooks.version(1).stores({
    notebooks: '++id,title,created'
});
localNotes.version(1).stores({
    notes: '++id,created,modified,notebookID,content,title'
});


/** Restores notebooks and notes from a backup file and sets (possibly
* overriding) the data in indexed db. */
export async function restore(array) {
    const nbs = await array.filter(item => !item.hasOwnProperty('notebookID'));
    const nts = await array.filter(item => item.hasOwnProperty('notebookID'));
    await localNotebooks.notebooks.bulkAdd(nbs);
    await localNotes.notes.bulkAdd(nts);
}


/** Uses indexed db to create a new notebook. */
export async function createNotebook(title) {
    // You don't need the _id or userID properties because
    // they will be set when you sync online.
    const schema = {
        title,
        created: Date.now(),
        id: Globals.randomID(),
    };
    await localNotebooks.notebooks.add(schema);
}

/** Retrieves a notebook from indexed db. */
export async function getNotebook(id) {
    const nb = await localNotebooks.notebooks.where("id").equals(id).toArray();
    return nb[0];
}

/** Gets a list of all the notebooks in the db. */
export async function getNotebooks() {
    const nbs = await localNotebooks.notebooks.toArray();
    return nbs;
}

/** Deletes a notebook from indexed db as well as its notes. */
export async function deleteNotebook(id) {
    const nb = await localNotebooks.notebooks.where("id").equals(id).toArray();
    const nts = await localNotes.notes.where("notebookID").equals(nb.id).toArray();
    await Promise.all(nts.forEach(async note => await loadNotes.notes.delete(note.id)));
    await localNotebooks.notebooks.delete(id);
}



/** Creates a new note under a given notebook. */
export async function createNote(title, content, notebookID) {
    const schema = {
        id: Globals.randomID(),
        created: Date.now(),
        modified: Date.now(),
        notebookID,
        content,
        title
    }
    await loadNotes.notes.add(schema);
}

/** Returns a note from indexed db. */
export async function getNote(id) {
    const nt = await localNotes.notes.where("id").equals(id).toArray();
    return nt[0];
}

/** Gets a list of all the notes in a notebook. */
export async function getNotes(notebookID) {
    const nts = await localNotes.notes.where("notebookID").equals(notebookID).toArray();
    return nts;
}

/** Gets a list of all the notes in the db. */
export async function getAllNotes() {
    const nts = await localNotes.notes.toArray();
    return nts;
}

/** Updates a note in the db. */
export async function saveNote(id, title, content) {
    await loadNotes.notes.update(id, {
        title, content
    });
}

/** Moves a local note from one local notebook to another. */
export async function move(id, toNotebook) {
    await localNotes.notes.update(id, {
        notebookID: toNotebook
    });
}

/** Deletes a note from indexed db. */
export async function deleteNote(id) {
    await localNotes.notes.delete(id);
}


/** Saves the local data to the online database. */
export async function saveOnline() {
    
}