import { Mosaic } from "@authman2/mosaic";

export default new Mosaic({
    actions: {
        switchContext: function() {
            this.parent.data.context = 1;
        }
    },
    view: function() {
        return <div class={`context-menu context-menu-0`}>
            <div class='context-menu-item' onclick={this.parent.actions.handleNew}>
                <i class="fas fa-file"></i>
                <p>New</p>
            </div>
            <div class='context-menu-item' onclick={this.parent.actions.openNotebooks}>
                <i class="fas fa-book-open"></i>
                <p>Notebooks</p>
            </div>
            <div class='context-menu-item' onclick={this.parent.actions.openNotes}>
                <i class='fas fa-bars'></i>
                <p>Notes</p>
            </div>
            <div class='context-menu-item' onclick={this.actions.switchContext}>
                <i class="fas fa-sync-alt"></i>
                <p>Context</p>
            </div>
        </div>
    }
});