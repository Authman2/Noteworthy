import Mosaic, { html } from 'mosaic-framework';

import CreatePopup from '../popups/new-popup';
import NotebooksPopup from '../popups/notebooks-popup';
import NotesPopup from '../popups/notes-popup';
import MovePopup from '../popups/move-popup';
import FindPopup from '../popups/find-popup';
import SettingsPopup from '../popups/settings-popups';

import * as Globals from '../util/Globals';
import Portfolio from '../util/Portfolio';
import * as Networking from '../util/Networking';

import '../styles/context-menu.less';


// A single context item.
Mosaic({
    name: 'context-item',
    data: {
        action: ()=>{}
    },
    created() {
        const { action } = this.data;
        this.addEventListener('click', action);
    },
    willDestroy() {
        const { action } = this.data;
        this.removeEventListener('click', action);
    },
    view: function() {
        return html`${this.descendants}`
    }
})

// The full context menu.
export default Mosaic({
    name: 'context-menu',
    element: 'context-menu',
    view: function() {
        return html`
            <context-item action='${this.createNew}' id='ci-New'>
                <ion-icon name='add'></ion-icon>
            </context-item>

            <context-item action='${this.openNotebooks}' id='ci-Notebooks'>
                <ion-icon name='ios-book'></ion-icon>
            </context-item>

            <context-item action='${this.openNotes}' id='ci-Notes'>
                <ion-icon name='paper'></ion-icon>
            </context-item>

            <context-item action='${this.handleSave}' id='ci-Save'>
                <ion-icon name='save'></ion-icon>
            </context-item>

            <context-item action='${this.handleFavorite}' id='ci-Favorite'>
                <ion-icon name='heart'></ion-icon>
            </context-item>

            <context-item action='${this.handleMove}' id='ci-Move'>
                <ion-icon name='move'></ion-icon>
            </context-item>

            <context-item action='${this.handleSearch}' id='ci-Search'>
                <ion-icon name='search'></ion-icon>
            </context-item>

            <context-item action='${this.handleSettings}' id='ci-Settings'>
                <ion-icon name='settings'></ion-icon>
            </context-item>
        `
    },


    createNew() {
        if(document.contains(CreatePopup)) CreatePopup.animateAway();
        else CreatePopup.paint({ ci: 'ci-New' });
    },
    openNotebooks() {
        if(document.contains(NotebooksPopup)) NotebooksPopup.animateAway();
        else NotebooksPopup.paint({ ci: 'ci-Notebooks' });
    },
    openNotes() {
        const currentNB = Portfolio.get('currentNotebook');
        if(!currentNB)
            return Globals.displayTextAlert(
                'Please select a notebook in order to view notes',
                Globals.red
            );

        if(document.contains(NotesPopup)) NotesPopup.animateAway();
        else NotesPopup.paint({ ci: 'ci-Notes' });
    },
    handleSave: async function() {
        const note = Portfolio.get('currentNote');
        if(!note)
            return Globals.displayTextAlert(
                `You must select a note before you can save!`, 
                Globals.red
            );

        // Save to the database.
        const title = document.getElementById('title-field').innerHTML;
        const content = document.getElementById('note-field').innerHTML;
        const res = await Networking.save(note._id, title, content);
        Globals.displayTextAlert(
            res.message,
            res.ok ? Globals.green : Globals.red
        );
    },
    async handleFavorite() {
        const currentNT = Portfolio.get('currentNote');
        if(!currentNT)
            return Globals.displayTextAlert(
                'Please select a note in order to favorite it',
                Globals.red
            );

        const resp = await Networking.toggleFavorite(currentNT._id);
        if(resp.ok) {
            // Update the favorite icon.
            const favoriteButton = document.getElementById('ci-Favorite');
            if(currentNT.favorited === false) {
                favoriteButton.style.color = '#FF6EA4';
                favoriteButton.style.backgroundColor = '#E2E2E2';
            } else {
                favoriteButton.style.color = 'white';
                favoriteButton.style.backgroundColor = '#AAAAAA'
            }
        }
        Globals.displayTextAlert(
            resp.message,
            resp.ok ? Globals.green : Globals.red
        );
    },
    handleMove() {
        const currentNT = Portfolio.get('currentNote');
        if(!currentNT)
            return Globals.displayTextAlert(
                'Please select a note in order to move it',
                Globals.red
            );

        if(document.contains(MovePopup)) MovePopup.animateAway();
        else MovePopup.paint({ ci: 'ci-Move' });
    },
    handleSearch() {
        if(document.contains(FindPopup)) FindPopup.animateAway();
        else FindPopup.paint({ ci: 'ci-Find' });
    },
    handleSettings() {
        if(document.contains(SettingsPopup)) SettingsPopup.animateAway();
        else SettingsPopup.paint({ ci: 'ci-Settings' });
    }
})