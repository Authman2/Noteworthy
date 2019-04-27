import { Portfolio } from '@authman2/mosaic';
import Globals from './util/Globals';

import NewAlert from './popups/new';
import ShareAlert from './popups/share';

const portfolio = new Portfolio({
    context: 0,
    loadedData: {},
    currentNotebook: null,
    currentNote: null,
    alert: ''
}, 
(event, data, newData) => {
    switch(event) {
        case 'switch-context':
            data.context = data.context === 3 ? 0 : data.context + 1;
            switch(data.context) {
                case 0: Globals.showActionAlert('Switched to <b>View</b> Context', Globals.ColorScheme.gray); break;
                case 1: Globals.showActionAlert('Switched to <b>Selection</b> Context', Globals.ColorScheme.gray); break;
                case 2: Globals.showActionAlert('Switched to <b>Insert</b> Context', Globals.ColorScheme.gray); break;
                case 3: Globals.showActionAlert('Switched to <b>Settings</b> Context', Globals.ColorScheme.gray); break;
                default: break;
            }
            break;
        case 'load-data':
            data.loadedData = newData.loadedData;
            break;
        case 'update-note':
            let id = newData.id;
            data.loadedData[id].title = newData.title;
            data.loadedData[id].content = newData.content;
            break;
        case 'select-note':
            data.currentNote = newData.currentNote;
            break;
        case 'select-notebook':
            data.currentNotebook = newData.currentNotebook;
            break;
        case 'show-new-alert':
            data.alert = NewAlert.new();
            document.getElementById('root').appendChild(data.alert.element);
            break;
        case 'show-share-alert':
            data.alert = ShareAlert.new();
            document.getElementById('root').appendChild(data.alert.element);
            break;
        case 'close-alert':
            document.getElementsByClassName('popup')[0].remove();
            data.alert = '';
            break;
        default:
            break;
    }
});

export default portfolio;