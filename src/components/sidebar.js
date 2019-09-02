import Mosaic from 'mosaic-framework';

import '../styles/sidebar.less';


export default new Mosaic({
    element: 'sidebar',
    name: 'side-bar',
    toggleNoteView(e) {
        const parent = e.currentTarget.parentElement;
        if(parent) {
            const caret = parent.getElementsByTagName('ion-icon')[0];
            const list = parent.getElementsByClassName(`nested`)[0];
            caret.classList.toggle('caret-down');
            list.classList.toggle('active');
        }
    },
    view() {
        return html`
        <ul>
            <span onclick='${this.toggleNoteView}'>
                <ion-icon class='caret' name="ios-arrow-down"></ion-icon>
                <span>Notebooks</span>
            </span>
            
            <li class="nested">
                <ul class='notebooks-list'>
                    <li>
                        <span onclick='${this.toggleNoteView}'>
                            <ion-icon class='caret' name="ios-arrow-down"></ion-icon>
                            <span>Data Structures</span>
                        </span>
                        <ul class="nested">
                            <li>Arrays</li>
                            <li>Graphs</li>
                        </ul>
                    </li>
                    
                    <li>
                        <span onclick='${this.toggleNoteView}'>
                            <ion-icon class='caret' name="ios-arrow-down"></ion-icon>
                            <span>Drawing 1 for Non-Majors</span>
                        </span>
                        <ul class="nested">
                            <li>Shading</li>
                            <li>Highlights</li>
                        </ul>
                    </li>
                </ul>
            </li>
        </ul>
        `
    }
});