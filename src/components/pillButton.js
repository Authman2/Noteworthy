export default new Mosaic({
    view() {
        return html`<button onclick='${this.data.onclick}' class='pill-button'>
            ${ this.data.title || "Pill Button" }
        </button>`
    }
});