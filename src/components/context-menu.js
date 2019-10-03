import Mosaic from 'mosaic-framework';

import CreatePopup from '../popups/new-popup';
import NotebooksPopup from '../popups/notebooks-popup';
import NotesPopup from '../popups/notes-popup';
import MovePopup from '../popups/move-popup';
import FindPopup from '../popups/find-popup';
import SettingsPopup from '../popups/settings-popups';

import Globals from '../util/Globals';
import Portfolio from '../util/Portfolio';
import * as Networking from '../util/Networking';

import '../styles/context-menu.less';


// A single context item.
new Mosaic({
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
export default new Mosaic({
    name: 'context-menu',
    element: 'context-menu',
    data: {
        items: [{
            name: 'New',
            icon: html`<ion-icon name='add'></ion-icon>`,
            action: function() {
                if(document.contains(CreatePopup)) CreatePopup.animateAway();
                else CreatePopup.paint({ ci: 'ci-New' });
            }
        },{
            name: 'Notebooks',
            icon: html`<ion-icon name='ios-book'></ion-icon>`,
            action: function() {
                if(document.contains(NotebooksPopup)) NotebooksPopup.animateAway();
                else NotebooksPopup.paint({ ci: 'ci-Notebooks' });
            }
        },{
            name: 'Notes',
            icon: html`<ion-icon name='paper'></ion-icon>`,
            action: function() {
                const currentNB = Portfolio.get('currentNotebook');
                if(!currentNB)
                    return Globals.showActionAlert(
                        'Please select a notebook in order to view notes',
                        Globals.ColorScheme.red
                    );

                if(document.contains(NotesPopup)) NotesPopup.animateAway();
                else NotesPopup.paint({ ci: 'ci-Notes' });
            }
        },{
            name: 'Save',
            icon: html`<ion-icon name='ios-save'></ion-icon>`,
            action: function() {
                this.handleSave();
            }
        },{
            name: 'Favorite',
            icon: html`<ion-icon name='heart'></ion-icon>`,
            action: async function() {
                const currentNT = Portfolio.get('currentNote');
                if(!currentNT)
                    return Globals.showActionAlert(
                        'Please select a note in order to favorite it',
                        Globals.ColorScheme.red
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
                Globals.showActionAlert(
                    resp.message,
                    resp.ok ? Globals.ColorScheme.green : Globals.ColorScheme.red
                );
            }
        },{
            name: 'Move',
            icon: html`<ion-icon name='move'></ion-icon>`,
            action: async function() {
                const currentNT = Portfolio.get('currentNote');
                if(!currentNT)
                    return Globals.showActionAlert(
                        'Please select a note in order to move it',
                        Globals.ColorScheme.red
                    );

                if(document.contains(MovePopup)) MovePopup.animateAway();
                else MovePopup.paint({ ci: 'ci-Move' });
            }
        },{
            name: 'Find',
            icon: html`<ion-icon name='search'></ion-icon>`,
            action: function() {
                if(document.contains(FindPopup)) FindPopup.animateAway();
                else FindPopup.paint({ ci: 'ci-Find' });
            }
        },{
            name: 'Settings',
            icon: html`<ion-icon name='settings'></ion-icon>`,
            action: function() {
                if(document.contains(SettingsPopup)) SettingsPopup.animateAway();
                else SettingsPopup.paint({ ci: 'ci-Settings' });
            }
        }]
    },
    view: function() {
        return html`${Mosaic.list(this.data.items, item => item.name, item => {
            return html`<context-item action='${item.action.bind(this)}' id='ci-${item.name}'>
                ${item.icon}
            </context-item>`
        })}`
    },
    handleSave: async function() {
        const note = Portfolio.get('currentNote');
        if(!note)
            return Globals.showActionAlert(
                `You must select a note before you can save!`, 
                Globals.ColorScheme.red
            );

        // Save to the database.
        const title = document.getElementById('title-field').innerHTML;
        const content = document.getElementById('note-field').innerHTML;
        const res = await Networking.save(note._id, title, content);
        Globals.showActionAlert(
            res.message,
            res.ok ? Globals.ColorScheme.green : Globals.ColorScheme.red
        );
    }
})