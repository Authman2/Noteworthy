import Mosaic, { html } from 'mosaic-framework';

import '../styles/buttons.less';


export default Mosaic({
    name: 'popup-button',
    received({ color }) {
        if(color) {
            this.style.borderColor = color;
            this.style.color = color;
        }
    },
    created() {
        this.style.borderColor = '#E7E7E7';
        this.style.color = '#E7E7E7';
    },
    view() {
        return html`${this.descendants}`
    }
});