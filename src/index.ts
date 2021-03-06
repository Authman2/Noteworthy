import 'babel-polyfill';
import { Router } from 'mosaic-framework';
import '@polymer/paper-spinner/paper-spinner';

import './components/text-field';
import './components/round-button';
import './components/popup-button';
import './components/code-segment';

import Home from './routes/home';
import SignUp from './routes/signup';
import Work from './routes/work';

import './styles/index.less';
import './styles/alerts.less';


// Paint the components.
const router = new Router('root');
router.addRoute(['/', '/login'], Home);
router.addRoute(['/signup', '/createaccount'], SignUp);
router.addRoute('/work', Work);
router.paint();

// Service worker.
if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./serviceWorker.js').then(() => {
        console.log('Registered service worker from client!');
    });
}

// Keyboard Shortcuts.
window.addEventListener('keydown', async e => {
    const contextMenu = document.getElementsByTagName('context-menu')[0];
    
    // Save.
    if(e.keyCode === 83 && e.metaKey === true) {
        e.preventDefault();
        if(contextMenu) (contextMenu as any).handleSave();
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
    if(e.keyCode === 67 && e.metaKey === true && e.shiftKey === true) {
        e.preventDefault();
        const code = `<code-segment></code-segment>`;
        document.execCommand('insertHTML', false, `<br>${code}<br>`);
    }
    
    // Print.
    if(e.keyCode === 80 && e.metaKey === true) {
        e.preventDefault();
        if(contextMenu) (contextMenu as any).style.visibility = 'hidden';
        window.print();
        if(contextMenu) (contextMenu as any).style.visibility = 'visible';
    }
});