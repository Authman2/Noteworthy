import Mosaic from '@authman2/mosaic';

export default new Mosaic({
    name: 'notes-page',
    created() {
        this.class = 'drawer-page';
    },
    view() {
        return html`
            <h1>Note1</h1>
            <h1>Note2</h1>
            <h1>Note3</h1>
            <h1>Note4</h1>
        `
    }
})