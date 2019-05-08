import { Router } from '@authman2/mosaic';
import 'babel-polyfill';

import Landing from './pages/landing';
import Login from './pages/login';
import Work from './pages/work';

import './styles/index.less';
import './styles/popups.less';

if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js').then(() => {
        console.log('Registered service worker!');
    });
}

// Setup the router.
const router = new Router('#root');
const titleBar = new Mosaic({ view: _ => html`<div class='title-bar'></div>` }).new();
router.addRoute('/', [
    titleBar,
    Landing.new()
]);
router.addRoute('/login', [
    titleBar,
    Login.new()
]);
router.addRoute('/work', [
    titleBar,
    Work.new()
]);
router.paint();

window.addEventListener('customHello', e => {
    console.log('Got here from the custom event!!!!', e);
});
// Electron.
// remote.BrowserWindow.getFocusedWindow().on('quit-app', (event, command) => {
// 	remote.BrowserWindow.getFocusedWindow().emit('save');
// 	remote.app.quit();
// });