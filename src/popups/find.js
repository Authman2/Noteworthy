import Mosaic from 'mosaic-framework';

import '../components/round-button';

import * as Networking from '../util/Networking';
import Globals from '../util/Globals';
import Portfolio from '../util/Portfolio';


// Export the main component.
export default new Mosaic({
    name: 'find-popup',
    element: 'popups',
    portfolio: Portfolio,
    view() {
        return html`
        <round-button icon='document' highlightColor='#707070'>
            Find
        </round-button>
        <round-button icon='document' highlightColor='#707070'>
            Replace
        </round-button>
        <round-button icon='document' highlightColor='#707070'>
            Replace All
        </round-button>
        `
    }
});