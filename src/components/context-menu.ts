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
        const content = document.getElementById('note-field');
        content.focus();

        const node = document.createElement('code-segment');
        Globals.insertHTMLAtCaret(node);
    },
    insertOL: function() {
        const content = document.getElementById('note-field');
        content.focus();

        const node = document.createElement('ol');
        const itm = document.createElement('li');
        node.appendChild(itm);
        Globals.insertHTMLAtCaret(node);
    },
    insertUL: function() {
        const content = document.getElementById('note-field');
        content.focus();

        const node = document.createElement('ul');
        const itm = document.createElement('li');
        node.appendChild(itm);
        Globals.insertHTMLAtCaret(node);
    },
    insertDraw: function() {
        Globals.displayTextAlert('Drawing Pad: Coming Soon!', Globals.gray);
    },
});

// The full context menu.
export default Mosaic({
    name: 'context-menu',
    element: 'context-menu',
    view: function() {
        return html`
            <span class='tooltip' id='create-tt'>Create</span>
            <context-item onclick='${this.createNew}' id='ci-New'
                onmouseover="${this.showToolTip.bind(this, 'create-tt')}"
                onmouseout="${this.hideToolTip.bind(this, 'create-tt')}">
                <ion-icon name='add'></ion-icon>
            </context-item>

            <span class='tooltip' id='notebooks-tt'>Notebooks</span>
            <context-item onclick='${this.openNotebooks}' id='ci-Notebooks'
                onmouseover="${this.showToolTip.bind(this, 'notebooks-tt')}"
                onmouseout="${this.hideToolTip.bind(this, 'notebooks-tt')}">
                <ion-icon name='ios-book'></ion-icon>
            </context-item>

            <span class='tooltip' id='notes-tt'>Notes</span>
            <context-item onclick='${this.openNotes}' id='ci-Notes'
                onmouseover="${this.showToolTip.bind(this, 'notes-tt')}"
                onmouseout="${this.hideToolTip.bind(this, 'notes-tt')}">
                <ion-icon name='paper'></ion-icon>
            </context-item>

            <span class='tooltip' id='starred-tt'>Starred</span>
            <context-item onclick='${this.openStarred}' id='ci-Starred'
                onmouseover="${this.showToolTip.bind(this, 'starred-tt')}"
                onmouseout="${this.hideToolTip.bind(this, 'starred-tt')}">
                <ion-icon name='star'></ion-icon>
            </context-item>

            <span class='tooltip' id='save-tt'>Save</span>
            <context-item onclick='${this.handleSave}' id='ci-Save'
                onmouseover="${this.showToolTip.bind(this, 'save-tt')}"
                onmouseout="${this.hideToolTip.bind(this, 'save-tt')}">
                <ion-icon name='save'></ion-icon>
            </context-item>

            <span class='tooltip' id='favorite-tt'>Favorite</span>
            <context-item onclick='${this.handleFavorite}' id='ci-Favorite'
                onmouseover="${this.showToolTip.bind(this, 'favorite-tt')}"
                onmouseout="${this.hideToolTip.bind(this, 'favorite-tt')}">
                <ion-icon name='heart'></ion-icon>
            </context-item>

            <span class='tooltip' id='insert-tt'>Insert</span>
            <context-item onclick='${this.handleInsert}' id='ci-Insert'
                onmouseover="${this.showToolTip.bind(this, 'insert-tt')}"
                onmouseout="${this.hideToolTip.bind(this, 'insert-tt')}">
                <ion-icon name='attach'></ion-icon>
            </context-item>

            <span class='tooltip' id='move-tt'>Move</span>
            <context-item onclick='${this.handleMove}' id='ci-Move'
                onmouseover="${this.showToolTip.bind(this, 'move-tt')}"
                onmouseout="${this.hideToolTip.bind(this, 'move-tt')}">
                <ion-icon name='move'></ion-icon>
            </context-item>

            <span class='tooltip' id='find-tt'>Find/Replace</span>
            <context-item onclick='${this.handleSearch}' id='ci-Search'
                onmouseover="${this.showToolTip.bind(this, 'find-tt')}"
                onmouseout="${this.hideToolTip.bind(this, 'find-tt')}">
                <ion-icon name='search'></ion-icon>
            </context-item>

            <span class='tooltip' id='settings-tt'>Settings</span>
            <context-item onclick='${this.handleSettings}' id='ci-Settings'
                onmouseover="${this.showToolTip.bind(this, 'settings-tt')}"
                onmouseout="${this.hideToolTip.bind(this, 'settings-tt')}">
                <ion-icon name='settings'></ion-icon>
            </context-item>
        `
    },

    /** Shows a tooltip for a given context item. */
    showToolTip(id: string) {
        const tt = document.getElementById(id);
        tt.style.visibility = 'visible';
    },
    /** Hides a tooltip for a given context item. */
    hideToolTip(id: string) {
        const tt = document.getElementById(id);
        tt.style.visibility = 'hidden';
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