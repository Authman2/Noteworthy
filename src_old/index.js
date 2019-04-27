import Mosaic, { Router } from '@authman2/mosaic';
import remote from 'electron'
const BW = remote.BrowserWindow;
const app = remote.app;

import Home from './pages/home';
import Work from './pages/work';

// import './styles/index.css';
// import './styles/context-menu.css';
// import './styles/home.css';
// import './styles/work.css';
// import './styles/popups.css';

const router = new Router('#root');

const titleBar = new Mosaic({
	view: _ => html`<div class='title-bar'></div>`
}).new();

router.addRoute('/', [
	titleBar,
	Home.new()
]);
router.addRoute('/work', [
	titleBar,
	Work.new()
]);
router.paint();

BW.getFocusedWindow().on('quit-app', (event, command) => {
	BW.getFocusedWindow().emit('save');
	app.quit();
});