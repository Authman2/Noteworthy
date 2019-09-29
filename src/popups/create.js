import Mosaic from 'mosaic-framework';


export default new Mosaic({
    name: 'new-popup',
    element: 'popups',
    data: {
        type: 0,
        notebooks: [],
        selectedNotebook: null
    },
    created: function() {

    },
    toggleType: function(to) {
        this.data.type = to;
    },
    view: function() {
        const { type, notebooks } = this.data;

        return html`
            <popup-button color='${type === 0 ? "#2E31B2" : "#E7E7E7"}'
                style='color: ${type === 0 ? 'white' : '#979797'}'
                onclick='${this.toggleType.bind(this, 0)}'>
                Notebook
            </popup-button>
            
            <popup-button color='${type === 1 ? "#2E31B2" : "#E7E7E7"}'
                style='color: ${type === 1 ? 'white' : '#979797'}'
                onclick='${this.toggleType.bind(this, 1)}'>
                Note
            </popup-button>

            <text-field title='Title'></text-field>

            ${
                type === 1 ? 
                    html`<div>
                        ${Mosaic.list(notebooks, nb => nb._id, nb => {
                            return html`<li>${nb.title}</li>`
                        })}
                    </div>`
                    :
                    ''
            }

            <round-button>Create</round-button>
        `
    },
    animateAway: function() {

    }
})