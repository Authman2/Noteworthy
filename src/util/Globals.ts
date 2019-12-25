import '../components/toast';
import '../components/delete-toast';
import '../components/find-toast';


/** Generates a random string id. */
export function randomID() {
    return '_' + Math.random().toString(36).substr(2, 15);
}

/** Displays a simple text alert on the screen. */
export function displayTextAlert(text: string, color: string, time: number = 2500) {
    hideAlert();
    
    const element = document.createElement('toast-alert');
    element.setAttribute('color', color);
    element.innerHTML = `${text}`;
    (element as any).paint();

    if(time !== 0) {
        setTimeout(() => {
            (element as any).closeToast(time);
        }, time);
    }
}

/** Displays a confirmation alert. */
export function displayConfirmationAlert(label: string, color: string, confirm) {
    hideAlert();

    const element = document.createElement('delete-toast');
    element.setAttribute('color', color);
    (element as any).paint();
    (element as any).data.label = `${label}`;
    (element as any).data.confirm = confirm;
}

/** Displays the alert for finding and replacing content in a note. */
export function displayFindReplaceAlert(color: string) {
    hideAlert();

    const element = document.createElement('find-toast');
    element.setAttribute('color', color);
    (element as any).paint();
}

/** Hides any kind of toast alert. */
export function hideAlert() {
    const toasts = document.getElementById('toasts');
    const alert = toasts.firstChild;
    if(!alert) return;
    (alert as any).closeToast();
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


/** A reference to the last insertion/selection point 
* in the typing area. */
export let lastSelectionPoint = null;


/** Updates the last selected range so you can use it for inserting. */
export function updateLastRange() {
    var range;
    if(window.getSelection && window.getSelection().getRangeAt) {
        range = window.getSelection().getRangeAt(0);
        lastSelectionPoint = range;
    } else if((document as any).selection && (document as any).selection.createRange) {
        range = (document as any).selection.createRange();
        lastSelectionPoint = range;
    }
}

/** Inserts html content at a particular location. */
export function insertHTMLAtCaret(node) {
    if(!lastSelectionPoint)
        return displayTextAlert('Select part of the text to insert something', red);

    var html;
    if(window.getSelection && window.getSelection().getRangeAt) {
        lastSelectionPoint.deleteContents();
        lastSelectionPoint.insertNode(node);
    } else if((document as any).selection && (document as any).selection.createRange) {
        html = (node.nodeType == 3) ? node.data : node.outerHTML;
        lastSelectionPoint.pasteHTML(html);
    }
}

/** Returns the html that is currently selected. */
export function getSelectionHtml() {
    var html = "";
    if (typeof window.getSelection != "undefined") {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var container = document.createElement("div");
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                container.appendChild(sel.getRangeAt(i).cloneContents());
            }
            html = container.innerHTML;
        }
    } else if (typeof (document as any).selection != "undefined") {
        if ((document as any).selection.type == "Text") {
            html = (document as any).selection.createRange().htmlText;
        }
    }
    return html;
}