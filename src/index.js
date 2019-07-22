import { Router } from '@authman2/mosaic';
import 'babel-polyfill';

import Landing from './pages/landing-page';
import Login from './pages/login-page';
import Work from './pages/work-page';

import './styles/index.less';


// Add a quick Array utility function.
Array.prototype.last = function() {
    if(this.length === 0) return null;
    else return this[this.length - 1];
}

const router = new Router('root');
router.addRoute('/', Landing);
router.addRoute('/login', Login);
router.addRoute('/work', Work);
router.paint();

// Service worker.
if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./serviceWorker.js').then(() => {
        console.log('Registered service worker from client!');
    });
}