import Mosaic from '@authman2/mosaic';

export default new Mosaic({
    name: 'notebooks-page',
    created() {
        this.class = 'drawer-page';
    },
    view() {
        return html`
            <h1>Working</h1>
        `
    }
})