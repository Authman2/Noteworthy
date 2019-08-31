import Mosaic from 'mosaic-framework';

import '../components/round-button';


export default new Mosaic({
    name: 'create-popup',
    element: 'popups',
    view() {
        return html`
        <h2>Create</h2>
        <input type='text' placeholder="Name"/>

        <round-button icon='document' highlightColor='#707070'>Create Note</round-button>
        <round-button icon='ios-book' highlightColor='#707070'>Create Notebook</round-button>
        `
    }
});