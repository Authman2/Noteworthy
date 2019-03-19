const $ = require('jquery');

const saveData = (loadedData) => {
    const uid = firebase.auth().currentUser.uid;
    const json = loadedData;
    const outer = `{"${uid}": ${JSON.stringify(json)}}`;
    firebase.database().ref().set(JSON.parse(outer));
}

const loadData = (then) => {
    const uid = firebase.auth().currentUser.uid;
    let loadedData = {};

    firebase.database().ref().orderByKey().equalTo(uid).once('value', (snap) => {
        const allNotebooksAndNotes = snap.val();
        if(allNotebooksAndNotes == null) return;

        // 1.) Get everything from the remote database and put it in the local database.
        const all = Object.values(allNotebooksAndNotes[uid]);
        
        loadedData = {};
        for(var id in all) {
            const item = all[id];
            loadedData[item.id] = item;
        }
        
        then(loadedData);
    });
}

/** Shows the action alert with some text. */
const showActionAlert = (text, color, time = 2500) => {
    let app = document.getElementById('root');
    $('.action-alert').remove();

    const alert = document.createElement('p');
    alert.className = 'action-alert';
    alert.innerHTML = text;
    alert.style.backgroundColor = color;
    app.appendChild(alert);

    setTimeout(() => {
        $(alert).animate({
            opacity: 0,
            bottom: '-10px'
        }, '0.3s', () => {
            const children = [].slice.call(app.children);
            if(children.includes(alert)) app.removeChild(alert);
        })
    }, time);
}

const randomID = () => {
    return '_' + Math.random().toString(36).substr(2, 15);
}

const ColorScheme = {
    blue: '#60A4EB',
    green: '#73BE4D',
    red: '#ea4d4d',
    gray: 'gray'
}

module.exports = {
    saveData,
    loadData,
    showActionAlert,
    randomID,
    ColorScheme
}