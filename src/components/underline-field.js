import Mosaic from '@authman2/mosaic';

export default new Mosaic({
    name: 'underline-field',
    data: { type: '', place: '' },
    view() {
        const { type, place } = this;
        return html`<input type='${type}' placeholder='${place}'>`
    }
})