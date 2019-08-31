import Mosaic from 'mosaic-framework';

import '../components/toolbar';

export default new Mosaic({
    name: 'work-page',
    view() {
        return html`
        <tool-bar></tool-bar>
        `
    }
});