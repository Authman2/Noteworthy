import { Router } from '@authman2/mosaic';
import 'babel-polyfill';
// import remote from 'electron';

import Home from './pages/home';
import Work from './pages/work';

import './styles/index.less';


// Setup the router.
const router = new Router('#root');
const titleBar = new Mosaic({ view: _ => html`<div class='title-bar'></div>` }).new();
router.addRoute('/', [
    titleBar,
    Home.new()
]);
router.addRoute('/work', [
    titleBar,
    Work.new()
]);
router.paint();

// Electron.
// remote.BrowserWindow.getFocusedWindow().on('quit-app', (event, command) => {
// 	remote.BrowserWindow.getFocusedWindow().emit('save');
// 	remote.app.quit();
// });