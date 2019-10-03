import Mosaic from 'mosaic-framework';

import '../styles/buttons.less';


export default new Mosaic({
    name: 'round-button',
    view() {
        return html`${this.descendants}`
    }
});