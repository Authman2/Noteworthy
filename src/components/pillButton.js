import { Mosaic } from '@authman2/mosaic';

export default new Mosaic({
    view() {
        return <button onclick={this.data.onclick} class='pill-button'>
            { this.children || "Pill Button" }
        </button>
    }
});