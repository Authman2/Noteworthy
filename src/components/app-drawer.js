import Mosaic from '@authman2/mosaic';

import '../styles/app-drawer.less';


export default new Mosaic({
    name: 'app-drawer',
    element: 'drawer',
    view() {
        return html`
            <header>
                <ion-icon name="close" onclick='${this.closeDrawer}'></ion-icon>
                <h1>Noteworthy</h1>
                <input type='search' placeholder='Find'>
            </header>
        `
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