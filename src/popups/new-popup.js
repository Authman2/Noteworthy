import Mosaic from 'mosaic-framework';

import * as Networking from '../util/Networking';


export default new Mosaic({
    name: 'new-popup',
    element: 'popups',
    useShadow: false,
    data: {
        type: 0,
        notebooks: [],
        selectedNotebook: null,
        ci: null
    },
    created: function() {
        const { ci } = this.data;
        if(ci) {
            const cib = document.getElementById(`ci-New`);
            this.style.top = `${cib.getBoundingClientRect().top}px`;
        }
    },
    updated: async function() {
        if(this.data.type === 1 && this.data.notebooks.length === 0) {
            const res = await Networking.loadNotebooks();
            if(res.ok) this.data.notebooks = res.notebooks;
            console.log(this.data.notebooks);
        }
    },
    view: function() {
        const { type, notebooks } = this.data;

        return html`
            <popup-button color='${type === 0 ? "#2E31B2" : "#E7E7E7"}'
                style='color: ${type === 0 ? 'white' : '#979797'}'
                onclick='${() => this.data.type = 0}'>
                Notebook
            </popup-button>
            
            <popup-button color='${type === 1 ? "#2E31B2" : "#E7E7E7"}'
                style='color: ${type === 1 ? 'white' : '#979797'}'
                onclick='${() => this.data.type = 1}'>
                Note
            </popup-button>

            <text-field title='Title'></text-field>

            ${
                type === 1 ? 
                    html`<div id='notebooks-list-for-new-popup'>
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
        this.classList.add('new-popup-out');
        setTimeout(() => {
            this.classList.remove('new-popup-out');
            this.remove();
        }, 400);
    }
})