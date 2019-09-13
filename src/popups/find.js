import Mosaic from 'mosaic-framework';

import '../components/round-button';

import * as Networking from '../util/Networking';
import Globals from '../util/Globals';
import Portfolio from '../util/Portfolio';


function selectElementContents(el) {
    var range = document.createRange();
    range.selectNodeContents(el);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}

// Export the main component.
export default new Mosaic({
    name: 'find-popup',
    element: 'popups',
    portfolio: Portfolio,
    willDestroy() {
        // Remove all highlights on the content field.
        const noteField = document.getElementById('note-field');
        Globals.traverse(noteField, node => {            
            if(node.style && node.style.backgroundColor === 'lightblue') {
                node.style.backgroundColor = 'unset';
            }
        });
    },
    view() {
        return html`
        <input type='text' id='find-field' placeholder="Find">
        <input type='text' id='replace-field' placeholder="Replace">

        <round-button icon='document' highlightColor='#707070' onclick='${this.actions.highlightFind}'>
            Find
        </round-button>
        <round-button icon='document' highlightColor='#707070' onclick='${this.actions.replaceCurrent}'>
            Replace
        </round-button>
        <round-button icon='document' highlightColor='#707070' onclick='${this.actions.replaceAll}'>
            Replace All
        </round-button>
        `
    },
    actions: {
        highlightFind() {
            const lookingFor = document.getElementById('find-field').value;
            const noteField = document.getElementById('note-field');
            
            // Remove anything that has a blue background.
            Globals.traverse(noteField, node => {
                if(node.style && node.style.backgroundColor === 'lightblue') {
                    node.style.backgroundColor = 'unset';
                }
            });
            
            // Highlight the ones you find.
            Globals.traverse(noteField, node => {
                // Make sure it's a text node.
                if(node.nodeType !== 3) return;
                
                const regex = new RegExp(lookingFor, 'gi');
                const found = regex.test(node.textContent);
                if(found) {
                    const containsText = new RegExp(/[a-z|A-Z|0-9]*/, 'gi');
                    if(!lookingFor || lookingFor.length === 0 || !containsText.test(lookingFor)) return;
                    else {
                        selectElementContents(node);
                        document.execCommand('backColor', true, 'lightblue');
                    }
                }
            });
        },
        replaceCurrent() {
            const replacingWith = document.getElementById('replace-field').value;
            const noteField = document.getElementById('note-field');
            
            // Find the first instance of a highlighted element.
            let found = false;
            Globals.traverse(noteField, node => {
                if(found === true) return;

                if(node.style && node.style.backgroundColor === 'lightblue') {
                    node.textContent = replacingWith;
                    found = true;
                }
            });
        },
        replaceAll() {
            const replacingWith = document.getElementById('replace-field').value;
            const noteField = document.getElementById('note-field');
            
            // Find the first instance of a highlighted element.
            Globals.traverse(noteField, node => {
                if(node.style && node.style.backgroundColor === 'lightblue') {
                    node.textContent = replacingWith;
                }
            });
        }
    }
});