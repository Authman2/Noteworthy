import 'babel-polyfill';

import Work from './routes/work';

import Globals from './util/Globals';
import * as Networking from './util/Networking';


Work.paint('root');

// Service worker.
if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./serviceWorker.js').then(() => {
        console.log('Registered service worker from client!');
    });
}

// Keyboard Shortcuts.
window.addEventListener('keydown', async e => {
    // Save.
    if(e.keyCode === 83 && e.metaKey === true) {
        const note = portfolio.get('currentNote');
        if(!note)
            return Globals.showActionAlert(`You must have a note open before you can save anything!`, Globals.ColorScheme.red, 3000);

        Globals.showActionAlert('Saving...');
        const title = document.getElementById('title-field').innerText;
        const content = document.getElementById('content-field').innerHTML;

        const result = await Networking.save(note.id, title, content);
        if(result.ok) Globals.showActionAlert(`Saved!`, Globals.ColorScheme.green);
        else {
            if(resp.err.includes('No current user')) Globals.showRefreshUserAlert();
            else Global.showActionAlert(result.err, Globals.ColorScheme.red);
        }
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
        if(document.getElementById('drawer').innerHTML === '') {
            AppDrawer.paint();
            AppDrawer.router = router;
            const overlay = document.getElementById('overlay');
            if(overlay) {
                overlay.style.opacity = 1;
                overlay.style.zIndex = 99;
            }
        } else {
            const overlay = document.getElementById('overlay');
            if(overlay) {
                overlay.style.opacity = 0;
                overlay.style.zIndex = -1;
            }
            AppDrawer.classList.add('close-app-drawer');
            setTimeout(() => {
                AppDrawer.classList.remove('close-app-drawer');
                AppDrawer.remove();
            }, 200);
        }
    }

    // Print.
    if(e.keyCode === 80 && e.metaKey === true) {
        e.preventDefault();
        document.getElementsByTagName('app-tools')[0].style.visibility = 'hidden';
        window.print();
        document.getElementsByTagName('app-tools')[0].style.visibility = 'visible';
    }
});