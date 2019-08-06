import Mosaic from 'mosaic-framework';

import '../components/rect-button';

const randomKey = () => Math.random().toString(36).slice(2);
export default new Mosaic({
    name: 'app-tools',
    element: 'tools',
    data: {
        tools: [{
            name: 'Code',
            key: randomKey()
        },{
            name: 'Bulleted List',
            key: randomKey()
        },{
            name: 'Numbered List',
            key: randomKey()
        },{
            name: 'Checkbox',
            key: randomKey()
        },{
            name: 'Bold',
            key: randomKey()
        },{
            name: 'Italic',
            key: randomKey()
        },{
            name: 'Underline',
            key: randomKey()
        },{
            name: 'Subscript',
            key: randomKey()
        },{
            name: 'Superscript',
            key: randomKey()
        },{
            name: 'Highlight',
            key: randomKey()
        },{
            name: 'Clear Highlight',
            key: randomKey()
        }]
    },
    view() {
        return html`${Mosaic.list(this.data.tools, tool => tool.key, tool => {
            return html`<rect-button color='#427fdb'>${tool.name}</rect-button>`
        })}`
    }
});