import Mosaic from '@authman2/mosaic';

import '../components/rect-button';

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

            <br><br>
            <rect-button color='gray'>Sign Out</rect-button>
        `
    }
})