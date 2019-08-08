import Mosaic from 'mosaic-framework';
import '@polymer/paper-spinner/paper-spinner.js';

import Globals from '../util/Globals';
import * as Networking from '../util/Networking';
import portfolio from '../portfolio';

import '../components/notebook-cell';

import '../styles/notebooks-page.less';


export default new Mosaic({
    name: 'notebooks-page',
    data: {
        notebooks: []
    },
    async created() {
        this.class = 'drawer-page';

        // Load the notebooks.
        this.refreshNotebooks();
    },
    async refreshNotebooks() {
        const result = await Networking.loadNotebooks();
        if(result.ok === true) {
            const nbs = result.notebooks;
            this.data.notebooks = nbs;
        } else {
            Globals.showActionAlert(result.err, Globals.ColorScheme.red);
        }
    },
    view() {
        return html`${this.data.notebooks.length > 0 ?
            this.data.notebooks
                .filter(notebook => {
                    const srh = portfolio.get('search');
                    if(srh && srh.length > 0) {
                        const reg = new RegExp(srh, 'gi');
                        return reg.test(notebook.title);
                    } else {
                        return true;
                    }
                })
                .map(notebook => {
                    return html`<notebook-cell notebook='${notebook}'></notebook-cell>`
                })
            :
            html`<paper-spinner active></paper-spinner>`
        }`
    }
})