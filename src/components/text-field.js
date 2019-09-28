import Mosaic from 'mosaic-framework';


export default new Mosaic({
    name: 'text-field',
    data: {
        title: ''
    },
    received({ type }) {
        if(type) this.type = type;
    },
    view: function() {
        return html`
        <label>${this.data.title}</label>
        <input type='${this.type || 'text'}'/>
        `
    },
    getValue() {
        const field = this.getElementsByTagName('input')[0];
        return field.value;
    }
})