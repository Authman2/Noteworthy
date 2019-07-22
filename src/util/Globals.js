import Networking from './Networking';

import '../components/toast-alert';
import '../alerts/delete-alert';
import '../alerts/move-alert';

/** Shows the action alert with some text. */
const showActionAlert = (text, color, time = 2500) => {
    const holder = document.getElementById('toasts');
    holder.innerHTML = `<toast-alert color='${color}'>
        ${text}
    </toast-alert>`;
    
    // Let 0 indicate infinite time.
    if(time !== 0) {
        const alert = document.getElementsByTagName('toast-alert')[0];
        setTimeout(() => {
            alert.classList.add('toast-alert-fade-out');
            setTimeout(() => {
                alert.classList.remove('toast-alert-fade-out');
                alert.remove();
            }, 500);
        }, time);
    }
}
const hideActionAlert = () => {
    const alert = document.getElementsByTagName('toast-alert')[0];
    if(alert) {
        alert.classList.add('toast-alert-fade-out');
        setTimeout(() => {
            alert.remove();
        }, 400);
    }
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

const showRefreshUserAlert = () => {
    const button = document.createElement('button');
    button.className = 'red-alert-button';
    button.innerHTML = `Refresh!`;
    button.addEventListener('click', async () => {
        const res = await Networking.refreshUser();
        if(res.ok === true) showActionAlert('Refreshed the current user!', ColorScheme.blue);
        else showActionAlert(res.err, ColorScheme.red);
    });
    showActionAlert(`Could not verify the current user. Click to refresh session!<br><br><div id='insert-alert-button'></div>`, ColorScheme.red, 5000);
    document.getElementById('insert-alert-button').appendChild(button);
}

/** Returns the date from an array. */
const getDateFromArray = (array) => {
    return new Date(...array);
}

const showDeleteAlert = (title, subtitle, note, type) => {
    const container = document.getElementById('alerts');
    const alert = document.createElement('delete-alert');
    container.appendChild(alert);
    
    alert.set({ title, subtitle, note, type });
}
const showMoveAlert = (title, subtitle, note) => {
    const container = document.getElementById('alerts');
    const alert = document.createElement('move-alert');
    container.appendChild(alert);
    
    alert.set({ title, subtitle, note });
}

export default {
    showActionAlert,
    hideActionAlert,
    randomID,
    ColorScheme,
    getDateFromArray,
    showRefreshUserAlert,
    showDeleteAlert,
    showMoveAlert
}