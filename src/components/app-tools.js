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
                const code = `<pre class='code-segment' onclick='this.focus()'><code>var x = 5;</code><br><br></pre>`;
                document.execCommand('insertHTML', false, `<br>${code}<br>`);
            }
        },{
            name: 'Bulleted List',
            key: randomKey(),
            action: function() {
                document.execCommand('insertUnorderedList');
            }
        },{
            name: 'Numbered List',
            key: randomKey(),
            action: function() {
                document.execCommand('insertOrderedList');
            }
        },{
            name: 'Checkbox',
            key: randomKey(),
            action: function() {
                document.execCommand('insertHTML', false, '<p><input class="checkbox" type="checkbox"><label>Checkbox Item</label></p><br/>');
                
                const checks = document.getElementsByClassName('checkbox');
                for(var i = 0; i < checks.length; i++) {
                    const item = checks[i];
                    
                    item.onchange = () => {
                        item.setAttribute('checked', item.checked);
                    }
                }
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