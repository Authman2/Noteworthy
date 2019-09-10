import Mosaic from 'mosaic-framework';

import './round-button';
import './dropdown-button';
import '../popups/create';
import '../popups/settings';
import '../popups/find';
import '../popups/font';
import '../popups/move';
import '../popups/share';

import Portfolio from '../util/Portfolio';
import * as Networking from '../util/Networking';

import '../styles/toolbar.less';
import Globals from '../util/Globals';


export default new Mosaic({
    name: 'tool-bar',
    portfolio: Portfolio,
    toggleSidebar() {
        const contentView = document.getElementsByTagName('content-view')[0];
        const sidebar = document.getElementsByTagName('side-bar')[0];
        if(contentView && sidebar) {
            contentView.classList.toggle('open-content-view');
            sidebar.classList.toggle('open-sidebar');
        }
    },
    async handleSave() {
        const note = Portfolio.get('currentNote');
        if(!note)
            return Globals.showActionAlert(`You must select a note before you can save!`, Globals.ColorScheme.red);

        // Save to the database.
        const title = document.getElementById('title-field').innerHTML;
        const content = document.getElementById('note-field').innerHTML;
        const res = await Networking.save(note._id, title, content);
        Globals.showActionAlert(res.message, res.ok ? Globals.ColorScheme.green : Globals.ColorScheme.red);

        // Reload just that item in the list.
        const sidebar = document.getElementsByTagName('side-bar')[0];
        if(sidebar) {
            sidebar.data.notebooks = [];
            await sidebar.loadNotes.call(sidebar);
        }
    },
    async handleShare() {

    },
    async handleFavorite() {

    },
    view() {
        return html`
        <h1 class='app-location'>${Portfolio.get('windowTitle')}</h1>
        
        <section class='toolbar-buttons'>
            <round-button onclick='${this.toggleSidebar}'>
                &nbsp;
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="#000000">
                    <path style="line-height:normal;text-indent:0;text-align:start;text-decoration-line:none;text-decoration-style:solid;text-decoration-color:#000000;text-transform:none;block-progression:tb;isolation:auto;mix-blend-mode:normal" d="M 5 3 C 3.9069372 3 3 3.9069372 3 5 L 3 19 C 3 20.093063 3.9069372 21 5 21 L 19 21 C 20.093063 21 21 20.093063 21 19 L 21 5 C 21 3.9069372 20.093063 3 19 3 L 5 3 z M 6 5 C 6.552 5 7 5.448 7 6 C 7 6.552 6.552 7 6 7 C 5.448 7 5 6.552 5 6 C 5 5.448 5.448 5 6 5 z M 9 5 C 9.552 5 10 5.448 10 6 C 10 6.552 9.552 7 9 7 C 8.448 7 8 6.552 8 6 C 8 5.448 8.448 5 9 5 z M 12 5 L 19 5 L 19 19 L 12 19 L 12 5 z M 5 8 L 10 8 L 10 10 L 5 10 L 5 8 z" font-weight="400" font-family="sans-serif" white-space="normal" overflow="visible"/>
                </svg>
            </round-button>
            <dropdown-button id='new-dropdown' icon='add' highlightColor='lightseagreen' popup='create-popup'>New</dropdown-button>
            <round-button icon='save' highlightColor='#7C73FF' onclick="${this.handleSave}">Save</round-button>
            <round-button icon='heart' highlightColor='#FF729E' onclick="${this.handleFavorite}">Favorite</round-button>
            <dropdown-button id='share-dropdown' icon='ios-share' highlightColor='#c9700a' popup='share-popup'>Share</dropdown-button>
            <dropdown-button icon='move' highlightColor='#0F9CF9' popup='move-popup'>Move</dropdown-button>
            <dropdown-button icon='search' highlightColor='#2abd56' popup='settings-popup'>Find</dropdown-button>
            <dropdown-button icon='information' highlightColor='#ba2d2d' popup='settings-popup'>Font</dropdown-button>
            <dropdown-button icon='settings' highlightColor='#A7A7A7' popup='settings-popup'>Settings</dropdown-button>
        </section>
        `
    }
})