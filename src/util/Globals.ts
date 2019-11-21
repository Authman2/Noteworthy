import '../components/toast';


/** Generates a random string id. */
export function randomID() {
    return '_' + Math.random().toString(36).substr(2, 15);
}

/** Displays a simple text alert on the screen. */
export function displayTextAlert(text: string, color: string, time: number = 2500) {
    const container = document.getElementById('toasts');
    const element = document.createElement('toast-alert');
    element.setAttribute('color', color);
    element.innerHTML = `${text}`;

    if(time !== 0) {
        const alert = document.getElementsByTagName('toast-alert')[0];
        if(!alert) return;

        setTimeout(() => {
            alert.classList.add('toast-alert-fade-out');
            setTimeout(() => {
                alert.classList.remove('toast-alert-fade-out');
                alert.remove();
            }, 500);
        }, time);
    }
}

/** Hides any kind of toast alert. */
export function hideAlert() {
    const alert = document.getElementsByTagName('toast-alert')[0];
    if(!alert) return;

    alert.classList.add('toast-alert-fade-out');
    setTimeout(() => {
        alert.remove();
    }, 500);
}


export const blue = '#60A4EB';
export const green = '#73BE4D';
export const red = '#ea4d4d';
export const gray = 'gray';


/** Traverses a DOM tree and performs an action on each node. */
export function traverse($node, action) {
    if(action) action($node);

    let children = $node.childNodes;
    for(var i = 0; i < children.length; i++)
        traverse(children[i], action);
}


/** A reference to the currently logged in user. */
export let currentUser = {};