import ContextMenu from '../components/contextMenu';

export default new Mosaic({
    data: {
        context: 0,
        loadedData: {},
        currentNotebook: null,
        currentNote: null,

        showingCreate: false,
        showingItems: false,
    },
    actions: {
        switchContext() {
            if(this.data.context === 3) this.data.context = 0;
            else this.data.context += 1;
        }
    },
    view: (data, actions) => html`<div class='work'>
        ${ ContextMenu.new({ type: data.context, items: data.loadedData }) }
        
        <div contenteditable="true" type='text' id='work-title-field'>
            ${ this.data.currentNote ? this.data.currentNote.title : 'Title' }
        </div>
        <div contenteditable="true" id='work-content-field'></div>


    </div>`,
});