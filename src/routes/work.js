import Mosaic from 'mosaic-framework';

import '../components/toolbar';

import '../styles/popups.less';


export default new Mosaic({
    name: 'work-page',
    view() {
        return html`
        <tool-bar></tool-bar>
        `
    }
});