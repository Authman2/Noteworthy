import Mosaic from '@authman2/mosaic';

import Globals from '../util/Globals';
import * as Networking from '../util/Networking';

import '../components/notebook-cell';


export default new Mosaic({
    name: 'notebooks-page',
    data: {
        notebooks: []
    },
    async created() {
        this.class = 'drawer-page';

        // Load the notebooks.
        const result = await Networking.loadNotebooks();
        if(result.ok === true) {
            const nbs = result.notebooks;
            console.log(nbs);
            this.data.notebooks = nbs;
        } else {
            Globals.showActionAlert(result.err, Globals.ColorScheme.red);
        }
    },
    view() {
        return html`${this.data.notebooks.map(notebook => {
            return html`<notebook-cell notebook='${notebook}'></notebook-cell>`
        })}`
    }
})