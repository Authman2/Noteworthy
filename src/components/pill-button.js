import Mosaic from '@authman2/mosaic';

export default new Mosaic({
    name: 'pill-button',
    data: {
        title: '',
        click: () => {}
    },
    created() {
        this.addEventListener('click', this.touchDown);
    },
    willDestroy() {
        this.removeEventListener('click', this.touchDown);
    },
    view() {
        return html`${this.title}`
    },
    touchDown() {
        const { click } = this.data;
        if(click) click();
    }
})