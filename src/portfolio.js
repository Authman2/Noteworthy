const Mosaic = require('@authman2/mosaic').default;
const Globals = require('./other/Globals');

const portfolio = new Mosaic.Portfolio({
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
                case 2: Globals.showActionAlert('Switched to <b>Insertion</b> Context', Globals.ColorScheme.gray); break;
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
        case 'close-alert':
            data.alert = '';
            break;
        case 'show-alert':
            data.alert = newData.alert;
            break;
        case 'create-new':
            let cb = data.currentNotebook;
            if(newData.type === 'Note' && !cb) break;
            data.loadedData[newData.randomID] = newData.obj;
            if(newData.type === 'Note') data.loadedData[cb.id].pages.push(newData.randomID);
            Globals.showActionAlert(`Created ${newData.type.toLowerCase()} called <b>${newData.obj.title}</b>`, Globals.ColorScheme.blue);
            break;
        default:
            break;
    }
});
module.exports = portfolio;