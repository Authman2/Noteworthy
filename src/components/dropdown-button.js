import Mosaic from 'mosaic-framework';

import Button from '../mixins/button';

import '../styles/buttons.less';


export default new Mosaic({
    name: 'dropdown-button',
    mixins: [Button],
    data: {
        opened: false,
        popup: undefined
    },
    created() {
        this.addEventListener('click', this.toggleDropdown);
    },
    willDestroy() {
        this.removeEventListener('click', this.toggleDropdown);
    },
    toggleDropdown() {
        let { popup } = this.data;
        this.data.opened = !this.data.opened;

        // Either show or remove the popup.
        if(this.data.opened === true) {
            if(popup) {
                const box = this.getBoundingClientRect();
                const el = document.createElement(popup);
                const toolbar = document.getElementsByTagName('tool-bar')[0];
                el.paint();
                if(toolbar) el.style.top = `${toolbar.getBoundingClientRect().bottom + 15}px`;
                if(box.x + box.width + 60 >= window.innerWidth) {
                    el.style.right = `15px`;
                } else {
                    el.style.left = `${box.x}px`;
                }
            }
        } else {
            if(popup) {
                let el = document.getElementsByTagName(popup)[0];
                if(el) el.remove();
            }
        }
    },
    view() {
        return html`
        ${ this.data.icon === '' ? '' : html`<ion-icon name='${this.data.icon}'></ion-icon>` }
        <span>${this.descendants}</span>
        <ion-icon name='ios-arrow-down'></ion-icon>
        `
    }
});