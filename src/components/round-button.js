import Mosaic from 'mosaic-framework';

import Button from '../mixins/button';

import '../styles/buttons.less';


export default new Mosaic({
    name: 'round-button',
    mixins: [Button],
    view() {
        return html`
        ${ this.data.icon === '' ? '' : html`<ion-icon name='${this.data.icon}'></ion-icon>` }
        <span>${this.descendants}</span>
        `
    }
});