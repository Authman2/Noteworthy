import Mosaic from '@authman2/mosaic';

import '../styles/drawer-card.less';


export default new Mosaic({
    name: 'drawer-card',
    received({ color }) {
        // set the background color.
        if(color) {
            const holder = this.getElementsByTagName('div')[0];
            if(holder) holder.style.backgroundColor = color;
        }
    },
    view() {
        return html`<div class='drawer-card'>
            ${this.descendants}
        </div>`
    }
});