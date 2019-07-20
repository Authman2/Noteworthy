import Mosaic from '@authman2/mosaic';

export default new Mosaic({
    name: 'underline-field',
    received(attrs) {
        const { type, place } = attrs;
        const input = this.getElementsByTagName('input')[0];
        
        if(type && input) input.type = type;
        if(place && input) input.placeholder = place;
    },
    view: () => html`<input>`
})