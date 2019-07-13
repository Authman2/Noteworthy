import Networking from './Networking';

/** Shows the action alert with some text. */
const showActionAlert = (text, color, time = 2500) => {
    if(document.getElementsByClassName('action-alert')[0])
        document.getElementsByClassName('action-alert')[0].remove();

    const alert = document.createElement('p');
    alert.className = 'action-alert';
    alert.innerHTML = text;
    alert.style.backgroundColor = color;
    document.body.appendChild(alert);

    // Let 0 indicate infinite time.
    if(time !== 0) {
        setTimeout(() => {
            alert.classList.add('action-alert-fade-out');
            setTimeout(() => {
                alert.classList.remove('action-alert-fade-out');
                alert.remove();
            }, 300);
        }, time);
    }
}
const hideActionAlert = () => {
    const alert = document.getElementsByClassName('action-alert')[0];
    if(alert) {
        alert.classList.add('action-alert-fade-out');
        setTimeout(() => {
            alert.classList.remove('action-alert-fade-out');
            alert.remove();
        }, 300);
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

module.exports = {
    showActionAlert,
    hideActionAlert,
    randomID,
    ColorScheme,
    showRefreshUserAlert
}