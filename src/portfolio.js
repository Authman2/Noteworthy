import { Portfolio } from "@authman2/mosaic";

export default new Portfolio({
    navigationPage: 'navigation'
},
(event, data, other) => {
    switch(event) {
        case 'go-to-notebooks':
            data.navigationPage = 'notebooks';
            return;
        case 'go-back':
            data.navigationPage = other.back;
            return;
    }
})