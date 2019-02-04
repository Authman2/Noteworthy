import { Mosaic } from "@authman2/mosaic";

const SelectionOptions = [{
    icon: 'fas fa-bold',
    title: 'Bold'
},{
    icon: 'fas fa-italic',
    title: 'Italic'
},{
    icon: 'fas fa-underline',
    title: 'Underline'
},{
    icon: 'fas fa-highlighter',
    title: 'Highlight'
},{
    icon: 'fas fa-subscript',
    title: 'Subscript'
},{
    icon: 'fas fa-superscript',
    title: 'Superscript'
}];


export default new Mosaic({
    actions: {
        switchContext: function() {
            this.parent.data.context = 2;
        }
    },
    view: function() {
        let type = type = SelectionOptions;
        return <div class={`context-menu context-menu-1`}>
            <div class='context-menu-item'>
                <i class="fas fa-file"></i>
                <p>New</p>
            </div>
            <div class='context-menu-item'>
                <i class="fas fa-book-open"></i>
                <p>Notebooks</p>
            </div>
            <div class='context-menu-item'>
                <i class='fas fa-bars'></i>
                <p>Notes</p>
            </div>
            <div class='context-menu-item' onclick={this.actions.switchContext}>
                <i class="fas fa-sync-alt"></i>
                <p>Context</p>
            </div>

            { type ? <span class="context-menu-separator"></span> : <div></div> }

            {
                type ? type.map(obj => {
                    return <div class='context-menu-item'>
                        <i class={obj.icon}></i>
                        <p>{obj.title}</p>
                    </div>
                }) : <div></div>
            }
        </div>
    }
});