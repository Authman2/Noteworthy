import { Portfolio } from "@authman2/mosaic";

export default new Portfolio({
    pages: ['navigation']
},
(event, data, other) => {
    switch(event) {
        case 'go-to-notebooks':
            data.pages.push('notebooks');
            return;
        case 'go-to-notes':
            data.pages.push('notes');
            return;
        case 'go-to-settings':
            data.pages.push('settings');
            return;
        case 'go-back':
            data.pages.splice(data.pages.length - 1, 1);
            return;
    }
})