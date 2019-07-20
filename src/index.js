import { Router } from '@authman2/mosaic';
import 'babel-polyfill';

import Landing from './pages/landing-page';
import Login from './pages/login-page';
import Work from './pages/work-page';

import './styles/index.less';


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

// Remove manifest for iOS.
const userAgent = navigator.userAgent.toLowerCase();
if(/iphone|ipad|ipod/.test(userAgent) === true) {
    document.querySelector(`link[rel="manifest"]`).setAttribute("rel", "no-on-ios");
}