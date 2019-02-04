import { Mosaic } from "@authman2/mosaic";

const SettingsOptions = [{
    icon: 'fas fa-user',
    title: 'Account'
},{
    icon: 'fas fa-save',
    title: 'Save Online'
},{
    icon: 'fas fa-download',
    title: 'Load Online'
}];

export default new Mosaic({
    actions: {
        switchContext: function() {
            this.parent.data.context = 0;
        }
    },
    view: function() {
        let type = SettingsOptions;
        return <div class={`context-menu context-menu-3`}>
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