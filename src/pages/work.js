import { Mosaic } from '@authman2/mosaic';
// import firebase from 'firebase';

import ContextMenu from '../components/contextMenu';

export default new Mosaic({
    view: function() {
        return <div class='work'>
            <div class='context-menu-holder'>
                <ContextMenu link={{ name: 'cm', parent: this }} />
            </div>

            <input type='text' placeholder='Title' id='work-title-field' />
            <div contenteditable='true' id='work-content-field' onclick={this.actions.switchContextOnTripleTap}>Note</div>
        </div>
    }
    //     return <div class='work'>
    //     <div class={`context-menu-holder ${isMobile() ? 'context-menu-holder-mobile' : ''}`}
    //         ontouchstart={this.actions.startLongPress}
    //         ontouchend={this.actions.invalidateLongPress}>
    //         { contextMenu }
    //     </div>

    //     <input type='text' 
    //         placeholder='Title' 
    //         id='work-title-field' />
    //     <div contenteditable='true' 
    //         id='work-content-field'
    //         onclick={this.actions.switchContextOnTripleTap}>Note</div>
        
    //     { alert }
    // </div>;
});