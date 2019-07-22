import Mosaic from '@authman2/mosaic';

import portfolio from '../portfolio';

import '../components/drawer-card';
import '../drawer-pages/navigation-page';
import '../drawer-pages/notebooks-page';
import '../drawer-pages/notes-page';
import '../drawer-pages/settings-page';

import '../styles/app-drawer.less';
import Globals from '../util/Globals';


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
                <input type='search' placeholder='Find'>
            </header>

            ${this.getDrawerPage}
        `
    },
    created() {
        const overlay = document.getElementById('overlay');
        if(overlay && !overlay.onclick) overlay.onclick = () => this.closeDrawer();
    },

    getDrawerPage() {
        const last = portfolio.get('pages').last();
        switch(last) {
            case 'navigation': return html`<navigation-page></navigation-page>`;
            case 'notebooks': return html`<notebooks-page></notebooks-page>`;
            case 'notes': return html`<notes-page></notes-page>`;
            case 'settings': return html`<settings-page></settings-page>`;
            default: return html`<h1>something</h1>`
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
    }
})