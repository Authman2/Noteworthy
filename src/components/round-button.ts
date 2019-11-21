import Mosaic, { html } from 'mosaic-framework';

import '../styles/buttons.less';


export default Mosaic({
    name: 'round-button',
    data: {
        color: ''
    },
    received({ color }) {
        if(color)
            this.style.color = color;
    },
    view() {
        return html`${this.descendants}`
    }
});