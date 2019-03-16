

export default new Mosaic({
    actions: {
        
    },
    view: function() {
        return html`<div class='context-menu ${'context-menu-0'}'>
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
            <div class='context-menu-item'>
                <i class="fas fa-sync-alt"></i>
                <p>Context</p>
            </div>
        </div>`
    }
});