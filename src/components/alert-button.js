import Mosaic from 'mosaic-framework';

export default new Mosaic({
    name: 'alert-button',
    data: {
        click: () => {}
    },
    received({ color }) {
        this.style.color = color;
    },
    created() {
        this.addEventListener('click', this.touchDown);
        this.addEventListener('mousedown', this.onActive);
        this.addEventListener('mouseup', this.onNotActive);
        this.addEventListener('mouseout', this.onNotActive);
        this.addEventListener('touchstart', this.onActive);
        this.addEventListener('touchend', this.onNotActive);
        this.addEventListener('touchcancel', this.onNotActive);
    },
    willDestroy() {
        this.removeEventListener('click', this.touchDown);
        this.removeEventListener('mousedown', this.onActive);
        this.removeEventListener('mouseup', this.onNotActive);
        this.removeEventListener('mouseout', this.onNotActive);
        this.removeEventListener('touchstart', this.onActive);
        this.removeEventListener('touchend', this.onNotActive);
        this.removeEventListener('touchcancel', this.onNotActive);
    },
    touchDown(e) {
        if(!e) e = window.event
        e.cancelBubble = true;
        if(e.stopPropogation) e.stopPropogation();
        
        const { click } = this.data;
        if(click) click();
    },
    onActive() {
        this.style.backgroundColor = 'lightgray';
    },
    onNotActive() {
        this.style.backgroundColor = 'rgba(0,0,0,0)';
    },
    view: self => html`${self.descendants}`
})