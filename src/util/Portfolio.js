import { Portfolio } from "mosaic-framework";

export default new Portfolio({
    windowTitle: 'Home',
    currentNotebook: undefined
}, (event, data, other) => {
    switch(event) {
        case 'select-notebook':
            data.currentNotebook = other.currentNotebook;
            break;
    }
})