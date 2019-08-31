import Networking from './Networking';

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

export default {
    showActionAlert,
    hideActionAlert,
    randomID,
    ColorScheme,
}