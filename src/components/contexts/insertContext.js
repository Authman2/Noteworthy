import { Mosaic } from "@authman2/mosaic";

const InsertOptions = [{
    icon: 'fas fa-code',
    title: 'Code'
},{
    icon: 'fas fa-list-ul',
    title: 'Unsorted'
},{
    icon: 'fas fa-list-ol',
    title: 'Sorted'
},{
    icon: 'fas fa-check',
    title: 'Checkbox'
},{
    icon: 'fas fa-image',
    title: 'Image'
}];


export default new Mosaic({
    actions: {
        switchContext: function() {
            this.parent.data.context = 3;
        }
    },
    view: function() {
        let type = InsertOptions;
        return <div class={`context-menu context-menu-2`}>
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