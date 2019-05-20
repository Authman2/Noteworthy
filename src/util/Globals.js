import $ from 'jquery';
import Networking from './Networking';

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
const hideActionAlert = () => {
    $('.action-alert').animate({
        opacity: 0,
        bottom: '-10px'
    }, '0.3s', () => {
        $('.action-alert').remove();
    })
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
}

module.exports = {
    showActionAlert,
    hideActionAlert,
    randomID,
    ColorScheme,
    showRefreshUserAlert
}