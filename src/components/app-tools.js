import Mosaic from 'mosaic-framework';

import '../components/rect-button';

const randomKey = () => Math.random().toString(36).slice(2);
export default new Mosaic({
    name: 'app-tools',
    element: 'tools',
    data: {
        tools: [{
            name: 'Code',
            key: randomKey(),
            action: function() {
                
            }
        },{
            name: 'Bulleted List',
            key: randomKey(),
            action: function() {
                
            }
        },{
            name: 'Numbered List',
            key: randomKey(),
            action: function() {
                
            }
        },{
            name: 'Checkbox',
            key: randomKey(),
            action: function() {
                
            }
        },{
            name: 'Bold',
            key: randomKey(),
            action: function() {
                document.execCommand('bold', true);
            }
        },{
            name: 'Italic',
            key: randomKey(),
            action: function() {
                document.execCommand('italic', true);
            }
        },{
            name: 'Underline',
            key: randomKey(),
            action: function() {
                document.execCommand('underline', true);
            }
        },{
            name: 'Subscript',
            key: randomKey(),
            action: function() {
                document.execCommand('subscript', true);
            }
        },{
            name: 'Superscript',
            key: randomKey(),
            action: function() {
                document.execCommand('superscript', true);
            }
        },{
            name: 'Highlight',
            key: randomKey(),
            action: function() {
                document.execCommand('backColor', true, 'yellow');
            }
        },{
            name: 'Clear Highlight',
            key: randomKey(),
            action: function() {
                document.execCommand('backColor', true, 'transparent');
            }
        }]
    },
    view() {
        return html`${this.data.tools.map(tool => {
            return html`<rect-button color='#427fdb' click='${tool.action}'>
                ${tool.name}
            </rect-button>`
        })}`
    }
});