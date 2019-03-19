const Mosaic = require('@authman2/mosaic').default;

const portfolio = new Mosaic.Portfolio({
    context: 0
},
(event, data, newData) => {
    switch(event) {
        case 'switch-context':
            data.context = data.context === 3 ? 0 : data.context + 1;
            console.log(data.context);
            break;
        default:
            break;
    }
});
module.exports = portfolio;