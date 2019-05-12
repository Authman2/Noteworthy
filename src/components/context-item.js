import Mosaic from '@authman2/mosaic';
import tippy from 'tippy.js';

export default new Mosaic({
    view: self => html`<button class='context-item'
        onclick='${self.data.click}'
        ontouchend='${self.data.click}'
        data-tippy-content='${self.data.title || ""}'
        onmouseover="${self.actions.tooltip}"><span class='${self.data.icon}'></span></button>`,
    actions: {
        tooltip() {
            tippy('.context-item', {
                content: `${this.data.title}`,
                arrow: true,
                duration: [150, 150],
                distance: 15,
                placement: 'bottom',
                size: 'medium'
            });
        }
    }
})