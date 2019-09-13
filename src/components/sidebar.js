import Mosaic from 'mosaic-framework';

import * as Networking from '../util/Networking';
import Portfolio from '../util/Portfolio';
import Globals from '../util/Globals';

import '../styles/sidebar.less';


export default new Mosaic({
    element: 'sidebar',
    name: 'side-bar',
    data: {
        notebooks: [],
        favorites: []
    },
    toggleNoteView(e) {
        const parent = e.currentTarget.parentElement;
        if(parent) {
            const caret = parent.getElementsByTagName('ion-icon')[0];
            const list = parent.getElementsByClassName(`nested`)[0];
            caret.classList.toggle('caret-down');
            list.classList.toggle('active');
        }
    },
    toggleFavoriteView(e) {
        const parent = e.currentTarget.parentElement;
        if(parent) {
            const caret = parent.getElementsByClassName('favorite-caret')[0];
            const list = parent.getElementsByClassName(`favorite-list`)[0];
            caret.classList.toggle('caret-down');
            list.classList.toggle('active');
        }
    },
    async loadNotes() {
        let objs = [];
        const nbResult = await Networking.loadNotebooks();
        if(!nbResult.ok) return console.log(nbResult.error);

        const notebooks = await nbResult.notebooks;
        await Promise.all(notebooks.map(async notebook => {
            const ntResult = await Networking.loadNotes(notebook._id);
            if(!ntResult.ok) return console.log(ntResult.error);

            const notes = await ntResult.notes;
            objs.push({ notes, id: notebook._id, title: notebook.title });

            if(objs.length === notebooks.length) this.data.notebooks = objs;
        }));
    },
    async loadFavorites() {
        const res = await Networking.getFavorites();
        if(res.ok === true) {
            this.data.favorites = res.favorites;
        } else {
            return Globals.showActionAlert(res.error, Globals.ColorScheme.red);
        }
    },
    async handleDeleteNotebook(notebook) {
        Globals.showActionAlert(`
            Are you sure you want to delete the notebook ${notebook.title}?
            <round-button highlightColor='cornflowerblue' id='toast-yes-btn'>Yes</round-button>
            <round-button highlightColor='red' id='toast-no-btn'>No</round-button>
        `, Globals.ColorScheme.red, 0);

        // Define event listeners.
        const confirmBtn = document.getElementById('toast-yes-btn');
        const declineBtn = document.getElementById('toast-no-btn');
        confirmBtn.onclick = async () => {
            const res = await Networking.deleteNotebook(notebook.id);
            Globals.showActionAlert(res.message, Globals.ColorScheme.green);
            Globals.hideActionAlert();
        }
        declineBtn.onclick = () => {
            Globals.hideActionAlert();
        }
    },
    openNote(note) {
        Portfolio.dispatch('select-note', { currentNote: note });

        const titleField = document.getElementById('title-field');
        const contentField = document.getElementById('note-field');
        titleField.innerHTML = note.title;
        contentField.innerHTML = note.content;

        const toolbar = document.getElementsByTagName('tool-bar')[0];
        if(toolbar) toolbar.toggleSidebar();
    },
    created() {
        // Load all of the notebooks and notes from the local indexed db.
        const token = localStorage.getItem('noteworthy-token');
        if(token) {
            this.loadNotes();
            this.loadFavorites();
        }
    },
    view() {
        return html`
        <ul>
            <span onclick='${this.toggleNoteView}'>
                <ion-icon class='caret' name="ios-arrow-down"></ion-icon>
                <span>Notebooks</span>
            </span>

            <li class="nested">
                <ul class='notebooks-list'>
                    ${Mosaic.list(this.data.notebooks, nb => nb.id, nb => {
                        return html`<li>
                            <span onclick='${this.toggleNoteView}'>
                                <ion-icon class='caret' name="ios-arrow-down"></ion-icon>
                                <span>${nb.title}</span>
                            </span>
                            <ion-icon name="trash" onclick="${this.handleDeleteNotebook.bind(this, nb)}"></ion-icon>
                            <ul class="nested">
                                ${Mosaic.list(nb.notes, n => n.id, n => {
                                    return html`<li onclick="${this.openNote.bind(this, n)}">
                                        ${n.title}
                                    </li>`
                                })}
                            </ul>
                        </li>`
                    })}
                </ul>
            </li>

            <br><br>

            <span onclick='${this.toggleFavoriteView}'>
                <ion-icon class='caret favorite-caret' name="ios-arrow-down"></ion-icon>
                <span>Favorites</span>
            </span>
            <li class="nested favorite-list">
                <ul class='favorites-list'>
                    ${Mosaic.list(this.data.favorites, nt => nt.id, nt => {
                        return html`<li onclick="${this.openNote.bind(this, nt)}">
                            ${nt.title}
                        </li>`
                    })}
                </ul>
            </li>
        </ul>
        `
    }
});