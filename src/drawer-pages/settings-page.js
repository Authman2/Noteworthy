import Mosaic from 'mosaic-framework';

import '../components/rect-button';
import AppDrawer from '../components/app-drawer';

import * as Networking from '../util/Networking';

import '../styles/settings-page.less';


export default new Mosaic({
    name: 'settings-page',
    created() {
        this.class = 'drawer-page';
    },
    view() {
        return html`
            <h2>Account Information</h2>
            <h3><b>Email:</b> authman2@gmail.com</h3>
            <h3><b>Created Account:</b> May 7, 2019</h3>
            <h3><b>Last Logged In:</b> June 15, 2019</h3>

            <br>
            <rect-button color='gray' click='${this.signOut.bind(this)}'>Sign Out</rect-button>
            <br>
        `
    },
    async signOut() {
        const result = await Networking.logout();
        if(result.ok === true) {
            if(AppDrawer && AppDrawer.closeDrawer) AppDrawer.closeDrawer();
            this.router.send('/login');
        }
        else return;
    },
    
})