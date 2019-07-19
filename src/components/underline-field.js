import Mosaic from '@authman2/mosaic';

export default new Mosaic({
    name: 'underline-field',
    received(attrs) {
        const { type, place } = attrs;
        if(type && place) {
            const input = this.getElementsByTagName('input')[0];
            if(input) {
                input.type = type;
                input.placeholder = place;
            }
        }
    },
    view: () => html`<input>`
})