import Mosaic from 'mosaic-framework';
import turndown from 'turndown';

import '../components/round-button';

import * as Networking from '../util/Networking';
import Globals from '../util/Globals';
import Portfolio from '../util/Portfolio';

// Configure turndown.
const tdService = new turndown();
tdService.addRule('', {
    filter: 'mark',
    replacement: function(content) {
        return `==${content}==`
    }
})
tdService.addRule('', {
    filter: 'u',
    replacement: function(content) {
        return `<u>${content}</u>`
    }
})
tdService.addRule('', {
    filter: 'strike',
    replacement: function(content) {
        return `~~${content}~~`
    }
})
tdService.addRule('', {
    filter: 'sub',
    replacement: function(content) {
        return `~${content}~`
    }
})
tdService.addRule('', {
    filter: 'sup',
    replacement: function(content) {
        return `^${content}^`
    }
})
tdService.addRule('', {
    filter: 'br',
    replacement: function(content) {
        return `<br>`;
    }
})
tdService.addRule('', {
    filter: 'span',
    replacement: function(content) {
        return `==${content}==`;
    }
})


// Export the main component.
export default new Mosaic({
    name: 'share-popup',
    element: 'popups',
    portfolio: Portfolio,
    async shareVia(medium) {
        const note = Portfolio.get('currentNote');
        if(!note) {
            const dropdown = document.getElementsByTagName('share-dropdown')[0];
            if(dropdown) dropdown.toggleDropdown();
            return Globals.showActionAlert('You must select a note before sharing.', Globals.ColorScheme.red);
        }
        const link = document.createElement('a');
        let fileData = `data:application/xml;charset=utf-8,`;
        switch(medium) {
            case 'txt':
                fileData += `${note.title}\n\n${note.content}`;
                link.href = fileData;
                link.download = `${note.title}.txt`;
                link.click();
                break;
            case 'html':
                fileData += `<h1 style="font-size:36px">${note.title}</h1><br><br>${note.content}`;
                link.href = fileData;
                link.download = `${note.title}.html`;
                link.click();
                break;
            case 'md':
                const _html = note.content.replace(/<input class="checkbox" type="checkbox">/g, '[ ] ')
                    .replace(/<input class="checkbox" id="checkbox[0-9]*" type="checkbox">/g, '[ ] ')
                    .replace(/<input class="checkbox" type="checkbox" checked="false">/g, '[ ] ')
                    .replace(/<input class="checkbox" type="checkbox" checked="true">/g, '[x] ');
                const md = await tdService.turndown(_html);
                fileData += `${note.title}\n\n${md}`;
                link.href = fileData;
                link.download = `${note.title}.md`;
                link.click();
                break;
            default:
                break;
        }
    },
    view() {
        return html`
        <h2>Share</h2>
        <h4>Choose your preferred sharing method:</h4>

        <round-button icon='document' highlightColor='#707070'
            onclick='${this.shareVia.bind(this, 'txt')}'>
            Plain Text
        </round-button>
        <round-button icon='document' highlightColor='#707070'
            onclick='${this.shareVia.bind(this, 'html')}'>
            HTML
        </round-button>
        <round-button icon='document' highlightColor='#707070'
            onclick='${this.shareVia.bind(this, 'md')}'>
            Markdown
        </round-button>
        `
    }
});