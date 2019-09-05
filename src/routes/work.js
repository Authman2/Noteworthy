import Mosaic from 'mosaic-framework';

import '../components/toolbar';
import '../components/content-view';

import '../styles/popups.less';
import '../styles/work.less';


export default new Mosaic({
    name: 'work-page',
    view() {
        return html`
        <tool-bar></tool-bar>
        <content-view></content-view>
        `
    }
});