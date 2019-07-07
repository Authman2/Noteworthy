import Mosaic from '@authman2/mosaic';

export default new Mosaic({
    name: 'underline-field',
    view() {
        const { type, place } = this.data;
        return html`<input type='${type}' placeholder='${place}'>`
    }
})