import Mosaic from 'mosaic-framework';

import Button from '../mixins/button';

import '../styles/buttons.less';


export default new Mosaic({
    name: 'dropdown-button',
    mixins: [Button],
    data: {
        /** Whether or not the dropdown view is opened. */
        opened: false
    },
    created() {
        this.addEventListener('click', this.toggleDropdown);
    },
    willDestroy() {
        this.removeEventListener('click', this.toggleDropdown);
    },
    toggleDropdown() {
        this.data.opened = !this.data.opened;
    },
    view() {
        return html`
        ${ this.data.icon === '' ? '' : html`<ion-icon name='${this.data.icon}'></ion-icon>` }
        <span>${this.descendants}</span>
        <ion-icon name='ios-arrow-down'></ion-icon>
        `
    }
});