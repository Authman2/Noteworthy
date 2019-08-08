import Mosaic from 'mosaic-framework';

import '../components/rect-button';
import AppDrawer from '../components/app-drawer';

import * as Networking from '../util/Networking';
import Globals from '../util/Globals';

import '../styles/settings-page.less';


export default new Mosaic({
    name: 'settings-page',
    data: {
        created: '------',
        loggedIn: '------'
    },
    created() {
        this.class = 'drawer-page';
        this.loadDetail();
    },
    async loadDetail() {
        let detail = {};
        const result = await Networking.getUserInfo();
        if(result.ok === true) {
            detail = result.info;

            let c = this.data.created;
            let d = this.data.loggedIn;

            if(detail && detail.createdAt) c = new Date(parseInt(detail.createdAt)).toDateString();
            if(detail && detail.lastLoginAt) d = new Date(parseInt(detail.lastLoginAt)).toDateString();
            this.set({ created: c, loggedIn: d });
        } else {
            Globals.showActionAlert(`${result.error}`, Globals.ColorScheme.red, 4000);
        }
    },
    view() {
        return html`
            <h2 class='settings-child'>Account Information</h2>
            <h3 class='settings-child'><b>Email:</b> authman2@gmail.com</h3>
            <h3 class='settings-child'><b>Created Account:</b> ${this.data.created}</h3>
            <h3 class='settings-child'><b>Last Logged In:</b> ${this.data.loggedIn}</h3>

            <br>
            <rect-button class='settings-child' color='gray' click='${this.signOut.bind(this)}'>Sign Out</rect-button>
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