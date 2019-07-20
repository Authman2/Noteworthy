import Mosaic from '@authman2/mosaic';

export default new Mosaic({
    name: 'pill-button',
    data: { click: () => {} },
    created() {
        this.addEventListener('click', this.touchDown);
    },
    willDestroy() {
        this.removeEventListener('click', this.touchDown);
    },
    touchDown() {
        const { click } = this.data;
        if(click) click();
    },
    view: self => html`${self.descendants}`
})