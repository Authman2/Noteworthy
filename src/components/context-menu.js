import Mosaic from 'mosaic-framework';

import CreatePopup from '../popups/new-popup';

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
                if(document.contains(CreatePopup)) CreatePopup.remove();
                else {
                    CreatePopup.paint();
                    const ci = document.getElementById(`ci-New`);
                    CreatePopup.style.top = `${ci.offsetTop}px`;
                }
            }
        },{
            name: 'Notebooks',
            icon: html`<ion-icon name='ios-book'></ion-icon>`,
            action: function() {
                console.log("Notebooks!");
            }
        },{
            name: 'Notes',
            icon: html`<ion-icon name='paper'></ion-icon>`,
            action: function() {
                console.log("Notes");
            }
        },{
            name: 'Favorite',
            icon: html`<ion-icon name='heart'></ion-icon>`,
            action: function() {
                console.log("Favorite");
            }
        },{
            name: 'Move',
            icon: html`<ion-icon name='move'></ion-icon>`,
            action: function() {
                console.log("Moving the note");
            }
        },{
            name: 'Find',
            icon: html`<ion-icon name='search'></ion-icon>`,
            action: function() {
                console.log("Searching");
            }
        },{
            name: 'Settings',
            icon: html`<ion-icon name='settings'></ion-icon>`,
            action: function() {
                console.log("Settings");
            }
        }]
    },
    view: function() {
        return html`${Mosaic.list(this.data.items, item => item.name, item => {
            return html`<context-item action='${item.action}' id='ci-${item.name}'>
                ${item.icon}
            </context-item>`
        })}`
    }
})