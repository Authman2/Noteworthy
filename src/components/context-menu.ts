import Mosaic, { html } from 'mosaic-framework';

import '../fullscreens/new-view';
import '../fullscreens/notebooks-view';
import '../fullscreens/notes-view';
import '../fullscreens/favorites-view';
import '../fullscreens/move-view';
import '../fullscreens/settings-view';

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
});

// An extended side menu of context items.
Mosaic({
    name: 'insert-context-menu',
    animateAway: function() {
        this.classList.add('hide-cm');
        setTimeout(() => this.remove(), 350);
    },
    view: function() {
        return html`
            <context-item onclick='${this.insertCode}'>
                <ion-icon name='code'></ion-icon>
            </context-item>

            <context-item onclick='${this.insertUL}'>
                <ion-icon name='list'></ion-icon>
            </context-item>

            <context-item onclick='${this.insertOL}'>
                <ion-icon name='options'></ion-icon>
            </context-item>

            <context-item onclick='${this.insertDraw}' id='ci-Starred'>
                <ion-icon name='brush'></ion-icon>
            </context-item>
        `
    },
    insertCode: function() {
        console.log('Inserting code!');
    },
    insertOL: function() {
        document.execCommand('insertOrderedList', false);
    },
    insertUL: function() {
        document.execCommand('insertUnorderedList', false);
    },
    insertDraw: function() {
        console.log('Inserting drawing area!');
    },
});

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

            <context-item onclick='${this.handleInsert}' id='ci-Insert'>
                <ion-icon name='attach'></ion-icon>
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
        const fsView = document.createElement('favorites-view');
        fsView.classList.add('fs');
        (fsView as any).paint();
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
            currentNT.favorited = !currentNT.favorited;
            const favoriteButton = document.getElementById('ci-Favorite');
            if(currentNT.favorited === true) {
                favoriteButton.style.color = '#FF6EA4';
                favoriteButton.style.backgroundColor = '#E2E2E2';
            } else {
                favoriteButton.style.color = 'white';
                favoriteButton.style.backgroundColor = '#AAAAAA'
            }
        }
        Globals.displayTextAlert(
            resp.message,
            resp.ok && currentNT.favorited === true ? Globals.green : Globals.gray
        );

    },
    handleInsert() {
        const found = document.getElementsByTagName('insert-context-menu')[0];
        if(found) return (found as any).animateAway();

        const insertMenu = document.createElement('insert-context-menu');
        document.body.appendChild(insertMenu);
        
        const insertIcon = document.getElementById('ci-Insert');
        const bounds = insertIcon?.getBoundingClientRect();
        insertMenu.style.top = `${bounds.top + 20}px`;
    },
    handleMove() {
        const currentNT = Portfolio.get('currentNote');
        if(!currentNT)
            return Globals.displayTextAlert(
                'Please select a note in order to move it',
                Globals.red
            );

        const fsView = document.createElement('move-view');
        fsView.classList.add('fs');
        (fsView as any).paint();
    },
    handleSearch() {
        Globals.hideAlert();
        Globals.displayFindReplaceAlert(Globals.gray);
    },
    handleSettings() {
        const fsView = document.createElement('settings-view');
        fsView.classList.add('fs');
        (fsView as any).paint();
        // if(document.contains(SettingsPopup)) SettingsPopup.animateAway();
        // else SettingsPopup.paint({ ci: 'ci-Settings' });
    }
})