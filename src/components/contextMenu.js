import { Mosaic } from "@authman2/mosaic";

const ContextMenuType = Object.seal({
    view: 0,
    selection: 1,
    insert: 2,
    settings: 3
});

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

const InsertOptions = [{
    icon: 'fas fa-code',
    title: 'Code'
},{
    icon: 'fas fa-ul',
    title: 'Unsorted'
},{
    icon: 'fas fa-ol',
    title: 'Sorted'
},{
    icon: 'fas fa-check',
    title: 'Checkbox'
},{
    icon: 'fas fa-image',
    title: 'Image'
}];

const SettingsOptions = [{
    icon: 'fas fa-user',
    title: 'Account'
},{
    icon: 'fas fa-save',
    title: 'Save Online'
},{
    icon: 'fas fa-load',
    title: 'Load Online'
}];



export default new Mosaic({
    data: { type: ContextMenuType.view },
    actions: {
        switchContext: function() {
            this.data.type = this.data.type === ContextMenuType.settings ? 0 : this.data.type + 1;
        }
    },
    view: function() {
        let type = null;
        switch(this.data.type) {
            case ContextMenuType.selection: type = SelectionOptions; break;
            case ContextMenuType.insert: type = InsertOptions; break;
            case ContextMenuType.settings: type = SettingsOptions; break;
            default: break;
        }
        return <div class={`context-menu context-menu-${this.data.type}`}>
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