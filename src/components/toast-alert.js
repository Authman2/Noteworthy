import Mosaic from 'mosaic-framework';

export default new Mosaic({
    name: 'toast-alert',
    received({ color }) {
        if(!color) return;
        this.style.backgroundColor = `${color}`;
    },
    view: self => html`${self.descendants}`
});