import { Portfolio } from "@authman2/mosaic";

export default new Portfolio({
    pages: ['navigation'],
    currentNotebook: undefined,
    currentNote: undefined
},
(event, data, other) => {
    switch(event) {
        case 'go-to-notebooks':
            data.pages.push('notebooks');
            return;
        case 'go-to-notes':
            data.pages.push('notes');
            data.currentNotebook = other.notebook;
            return;
        case 'go-to-settings':
            data.pages.push('settings');
            return;
        case 'go-back':
            data.pages.splice(data.pages.length - 1, 1);
            return;
        case 'select-note':
            data.currentNote = other.note;
            const titleField = document.getElementById('title-field');
            const contentField = document.getElementById('content-field');
            titleField.innerHTML = other.note.title;
            contentField.innerHTML = other.note.content;

            const drawer = document.getElementsByTagName('app-drawer')[0];
            const overlay = document.getElementById('overlay');
            if(overlay) {
                overlay.style.opacity = 0;
                overlay.style.zIndex = -1;
            }
            drawer.classList.add('close-app-drawer');
            setTimeout(() => {
                drawer.classList.remove('close-app-drawer');
                drawer.remove();
            }, 200);
            return;
    }
})