import Mosaic from 'mosaic-framework';

import '../styles/buttons.less';


export default new Mosaic({
    name: 'popup-button',
    received({ color }) {
        if(color) this.style.backgroundColor = color;
    },
    created() {
        this.style.backgroundColor = '#E7E7E7';
    },
    view() {
        return html`${this.descendants}`
    }
});