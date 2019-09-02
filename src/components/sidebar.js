import Mosaic from 'mosaic-framework';

import * as Local from '../util/LocalData';

import '../styles/sidebar.less';


export default new Mosaic({
    element: 'sidebar',
    name: 'side-bar',
    data: {
        notebooks: []
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
    async created() {
        // Load all of the notebooks and notes from the local indexed db.
        let objs = [];
        const notebooks = await Local.getNotebooks();
        if(notebooks) {
            notebooks.forEach(async notebook => {
                const notes = await Local.getNotes(notebook.id);
                objs.push({
                    notes,
                    id: notebook.id,
                    title: notebook.title,
                });

                if(objs.length === notebooks.length) {
                    this.data.notebooks = objs;
                }
            });
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
                            <ul class="nested">
                                ${Mosaic.list(nb.notes, n => n.id, n => {
                                    return html`<li>${n.title}</li>`
                                })}
                            </ul>
                        </li>`
                    })}
                </ul>
            </li>
        </ul>
        `
    }
});