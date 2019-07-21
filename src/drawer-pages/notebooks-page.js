import Mosaic from '@authman2/mosaic';

export default new Mosaic({
    name: 'notebooks-page',
    created() {
        this.class = 'drawer-page';
    },
    view() {
        return html`
            <h1>Notebook1</h1>
            <h1>Notebook2</h1>
            <h1>Notebook3</h1>
            <h1>Notebook4</h1>
        `
    }
})