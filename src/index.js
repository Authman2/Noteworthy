import { Router } from '@authman2/mosaic';

import Landing from './pages/landing-page';
import Login from './pages/login-page';

import './styles/index.less';


const router = new Router('root');
router.addRoute('/', Landing);
router.addRoute('/login', Login);
router.paint();

// Service worker.
if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./serviceWorker.js').then(() => {
        console.log('Registered service worker from client!');
    });
}