import Mosaic, { html } from 'mosaic-framework';

import '../fullscreens/new-view';
import '../fullscreens/notebooks-view';
import '../fullscreens/notes-view';
import MovePopup from '../fullscreens/move-popup';
import FindPopup from '../fullscreens/find-popup';
import SettingsPopup from '../fullscreens/settings-popups';

import * as Globals from '../util/Globals';
import Portfolio from '../util/Portfolio';
import * as Networking from '../util/Networking';

import '../styles/context-menu.less';


// A single context item.
Mosaic({
    name: 'context-item',
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
            <context-item onclick='${this.createNew}' id='ci-New'>
                <ion-icon name='add'></ion-icon>
            </context-item>

            <context-item onclick='${this.openNotebooks}' id='ci-Notebooks'>
                <ion-icon name='ios-book'></ion-icon>
            </context-item>

            <context-item onclick='${this.openNotes}' id='ci-Notes'>
                <ion-icon name='paper'></ion-icon>
            </context-item>

            <context-item onclick='${this.openStarred}' id='ci-Starred'>
                <ion-icon name='star'></ion-icon>
            </context-item>

            <context-item onclick='${this.handleSave}' id='ci-Save'>
                <ion-icon name='save'></ion-icon>
            </context-item>

            <context-item onclick='${this.handleFavorite}' id='ci-Favorite'>
                <ion-icon name='heart'></ion-icon>
            </context-item>

            <context-item onclick='${this.handleMove}' id='ci-Move'>
                <ion-icon name='move'></ion-icon>
            </context-item>

            <context-item onclick='${this.handleSearch}' id='ci-Search'>
                <ion-icon name='search'></ion-icon>
            </context-item>

            <context-item onclick='${this.handleSettings}' id='ci-Settings'>
                <ion-icon name='settings'></ion-icon>
            </context-item>
        `
    },


    createNew() {
        const fsView = document.createElement('new-view');
        fsView.classList.add('fs');
        (fsView as any).paint();
    },
    openNotebooks() {
        const fsView = document.createElement('notebooks-view');
        fsView.classList.add('fs');
        (fsView as any).paint();
    },
    openNotes() {
        const currentNB = Portfolio.get('currentNotebook');
        if(!currentNB)
            return Globals.displayTextAlert(
                'Please select a notebook in order to view notes',
                Globals.red
            );

        const fsView = document.createElement('notes-view');
        fsView.classList.add('fs');
        (fsView as any).paint();
    },
    openStarred() {
        
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
        Globals.displayTextAlert(res.message, res.ok ? Globals.green : Globals.red);
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
        Globals.displayTextAlert(resp.message, resp.ok ? Globals.green : Globals.red);
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