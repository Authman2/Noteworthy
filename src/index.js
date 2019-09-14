import 'babel-polyfill';

import Work from './routes/work';
import Sidebar from './components/sidebar';

import Globals from './util/Globals';
import * as Networking from './util/Networking';


// Paint the components.
Work.paint('root');
Sidebar.paint();

// Service worker.
if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./serviceWorker.js').then(() => {
        console.log('Registered service worker from client!');
    });
}

// Keyboard Shortcuts.
window.addEventListener('keydown', async e => {
    const toolbar = document.getElementsByTagName('tool-bar')[0];
    
    // Save.
    if(e.keyCode === 83 && e.metaKey === true) {
        if(toolbar) toolbar.handleSave();
    }

    // Underline.
    if(e.keyCode === 85 && e.metaKey === true) {
        document.execCommand('underline', true);
    }

    // Bulleted List.
    if(e.keyCode === 66 && e.shiftKey === true && e.metaKey === true) {
        e.preventDefault();
        document.execCommand('insertUnorderedList');
    }

    // Numbered List.
    if(e.keyCode === 73 && e.shiftKey === true && e.metaKey === true) {
        document.execCommand('insertOrderedList');
    }

    // Highlight.
    if(e.keyCode === 72 && e.metaKey === true) {
        e.preventDefault();
        document.execCommand('backColor', true, 'yellow');
    }

    // Code Segment.
    if(e.keyCode === 63 && e.metaKey === true && e.shiftKey === true) {
        const code = `<pre class='code-segment' onclick='this.focus()'><code>var x = 5;</code><br><br></pre>`;
        document.execCommand('insertHTML', false, `<br>${code}<br>`);
    }

    // Toggle Menu.
    if(e.keyCode === 79 && e.metaKey === true) {
        if(toolbar) toolbar.toggleSidebar();
    }

    // Print.
    if(e.keyCode === 80 && e.metaKey === true) {
        e.preventDefault();
        if(toolbar) toolbar.style.visibility = 'hidden';
        window.print();
        if(toolbar) toolbar.style.visibility = 'visible';
    }
});