import { Portfolio } from '@authman2/mosaic';
import Globals from './util/Globals';

import NewAlert from './popups/new';
import ShareAlert from './popups/share';
import NotebooksAlert from './popups/notebooks';
import AccountAlert from './popups/account';
import MoveAlert from './popups/move';
import DeleteAlert from './popups/delete';
import ResetPasswordAlert from './popups/reset-password';

export const portfolio = new Portfolio({
    context: 0,
    notebooks: [],
    notes: [],
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
        case 'load-notebooks':
            data.notebooks = newData.notebooks;
            break;
        case 'select-notebook':
            data.currentNotebook = newData.notebook;
            break;
        case 'load-notes':
            data.notes = newData.notes;
            break;
        case 'select-note':
            data.currentNote = newData.note;
            break;
        case 'show-new-alert':
            data.alert = NewAlert.new();
            document.getElementById('root').appendChild(data.alert.element);
            document.body.style.overflowY = 'hidden';
            break;
        case 'show-share-alert':
            data.alert = ShareAlert.new();
            document.getElementById('root').appendChild(data.alert.element);
            document.body.style.overflowY = 'hidden';
            break;
        case 'show-notebooks-alert':
            data.alert = NotebooksAlert.new({
                type: newData.type || 'Notebook',
                items: newData.type === 'Notebook' ? data.notebooks || [] : data.notes || []
            });
            document.getElementById('root').appendChild(data.alert.element);
            document.body.style.overflowY = 'hidden';
            break;
        case 'show-account-alert':
            data.alert = AccountAlert.new({ router: newData.router });
            document.getElementById('root').appendChild(data.alert.element);
            document.body.style.overflowY = 'hidden';
            break;
        case 'show-move-alert':
            data.alert = MoveAlert.new({
                notebooks: newData.notebooks,
                title: newData.title,
                currentNotebook: newData.currentNotebook,
                movingNote: newData.movingNote
            });
            document.getElementById('root').appendChild(data.alert.element);
            document.body.style.overflowY = 'hidden';
            break;
        case 'show-delete-alert':
            data.alert = DeleteAlert.new({
                type: newData.type, // notebook: 0, note: 1
                message: newData.message,
                title: newData.title,
                id: newData.id
            });
            document.getElementById('root').appendChild(data.alert.element);
            document.body.style.overflowY = 'hidden';
            break;
        case 'show-reset-password-alert':
            data.alert = ResetPasswordAlert.new();
            document.getElementById('root').appendChild(data.alert.element);
            document.body.style.overflowY = 'hidden';
            break;
        case 'close-alert':
            document.getElementsByClassName('popup')[0].remove();
            document.getElementsByClassName('popup-backdrop')[0].remove();
            data.alert = '';
            document.body.style.overflowY = 'auto';
            break;
        default:
            break;
    }
});