import Mosaic from 'mosaic-framework';

import '../components/round-button';


export default new Mosaic({
    name: 'settings-popup',
    element: 'popups',
    view() {
        return html`
        <h4>
            <b>Email</b>: 
        </h4>
        <h4>
            <b>Created</b>: 
        </h4>
        <h4>
            <b>Last Login</b>: 
        </h4>

        <round-button icon='sync' highlightColor='#707070'>Sync</round-button>
        <round-button icon='ios-log-out' highlightColor='#707070'>Logout</round-button>
        `
    }
});