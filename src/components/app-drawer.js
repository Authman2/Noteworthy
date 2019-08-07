import Mosaic from 'mosaic-framework';

import Globals from '../util/Globals';
import * as Networking from '../util/Networking';
import portfolio from '../portfolio';

import './drawer-card';
import './flat-rect-button';
import '../drawer-pages/navigation-page';
import '../drawer-pages/notebooks-page';
import '../drawer-pages/notes-page';
import '../drawer-pages/settings-page';
import CreateNew from '../alerts/create-new';

import '../styles/app-drawer.less';


export default new Mosaic({
    name: 'app-drawer',
    element: 'drawer',
    portfolio,
    view() {
        return html`
            <header>
                ${ portfolio.get('pages').last() !== 'navigation' ?
                    html`<ion-icon name="ios-arrow-back" onclick='${this.moveBackOnePage}'>
                    </ion-icon>` 
                    : ""
                }
                <ion-icon name="close" onclick='${this.closeDrawer}'></ion-icon>
                <h1>Noteworthy</h1>
                <input type='search' placeholder='Find' oninput='${this.search}'
                    id="find-field"
                    readonly='${portfolio.get('pages').last() === 'navigation' ? true : false}'>
            </header>

            <div>
                <flat-rect-button color='lightgray' click='${this.saveCurrentNote}'>
                    Save
                </flat-rect-button>
                <flat-rect-button color='lightgray' click='${this.createNote.bind(this)}'>
                    New Note
                </flat-rect-button>
                <flat-rect-button color='lightgray' click='${this.createNotebook.bind(this)}'>
                    New Notebook
                </flat-rect-button>
            </div>

            ${this.getDrawerPage.bind(this)}
        `
    },
    created() {
        const overlay = document.getElementById('overlay');
        if(overlay && !overlay.onclick) overlay.onclick = () => this.closeDrawer();
    },

    getDrawerPage() {
        const last = portfolio.get('pages').last();
        if(last === 'navigation') {
            document.getElementById('find-field').value = '';
        }
        switch(last) {
            case 'navigation': return html`<navigation-page></navigation-page>`;
            case 'notebooks': return html`<notebooks-page></notebooks-page>`;
            case 'notes': return html`<notes-page></notes-page>`;
            case 'settings': return html`<settings-page></settings-page>`;
            default: return html`<navigation-page></navigation-page>`;
        }
    },

    closeDrawer() {
        const overlay = document.getElementById('overlay');
        if(overlay) {
            overlay.style.opacity = 0;
            overlay.style.zIndex = -1;
        }
        this.classList.add('close-app-drawer');
        setTimeout(() => {
            this.classList.remove('close-app-drawer');
            this.remove();
        }, 200);
    },

    moveBackOnePage() {
        let selector = '';
        let last = portfolio.get('pages').last();
        if(last === 'notes') selector = '.note-cell';
        else if(last === 'notebooks') selector = '.notebook-cell';
        else selector = '.drawer-card';

        Globals.slideBackCard(selector, () => {
            portfolio.dispatch('go-back');
        });
    },

    async saveCurrentNote() {
        const note = portfolio.get('currentNote');
        if(!note)
            return Globals.showActionAlert(`You must have a note open before you can save anything!`, 
            Globals.ColorScheme.red, 3000);

        Globals.showActionAlert('Saving...');
        const title = document.getElementById('title-field').innerText;
        const content = document.getElementById('content-field').innerHTML;

        const result = await Networking.save(note.id, title, content);
        if(result.ok) Globals.showActionAlert(`Saved!`, Globals.ColorScheme.green);
        else {
            if(resp.err.includes('No current user')) Globals.showRefreshUserAlert();
            else Global.showActionAlert(result.err, Globals.ColorScheme.red);
        }
    },

    async createNote() {
        CreateNew.paint();
        CreateNew.set({ type: 'Note' });
        
        const drawer = document.getElementsByTagName('app-drawer')[0];
        if(!drawer) return;
        drawer.style.transform = 'translateX(100%)';
    },

    async createNotebook() {
        CreateNew.paint();
        CreateNew.set({ type: 'Notebook' });
        
        const drawer = document.getElementsByTagName('app-drawer')[0];
        if(!drawer) return;
        drawer.style.transform = 'translateX(100%)';
    },

    search(e) {
        const searchString = e.currentTarget.value;
        portfolio.dispatch('search', {
            search: searchString
        });
    }
})