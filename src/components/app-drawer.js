import Mosaic from '@authman2/mosaic';

import portfolio from '../portfolio';

import '../components/drawer-card';
import '../drawer-pages/navigation-page';
import '../drawer-pages/notebooks-page';

import '../styles/app-drawer.less';


export default new Mosaic({
    name: 'app-drawer',
    element: 'drawer',
    portfolio,
    view() {
        return html`
            <header>
                <ion-icon name="close" onclick='${this.closeDrawer}'></ion-icon>
                <h1>Noteworthy</h1>
                <input type='search' placeholder='Find'>
            </header>

            ${this.getDrawerPage}
        `
    },

    getDrawerPage() {
        switch(portfolio.get('navigationPage')) {
            case 'navigation': return html`<navigation-page></navigation-page>`;
            case 'notebooks': return html`<notebooks-page></notebooks-page>`
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
    }
})