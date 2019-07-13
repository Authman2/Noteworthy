import Mosaic from '@authman2/mosaic';

export default new Mosaic({
    name: 'pill-button',
    data: { title: '', click: () => {} },
    view() {
        return html`
        <button onpointerdown='${this.touchDown}'
                onpointerup='${this.touchUp}'
                onpointerout='${this.touchLeave}'>
            ${this.title}
        </button>
        `
    },
    touchDown(e) {
        e.target.style.color = '#427fdb';
        e.target.style.backgroundColor = 'white';
        if(e.pointerType === 'mouse')
            e.target.style.top = '4px';
    },
    touchUp(e) {
        e.target.style.top = '0px';
        e.target.style.color = 'white';
        e.target.style.backgroundColor = 'rgba(0,0,0,0)';

        const { click } = this;
        if(click) click();
    },
    touchLeave(e) {
        e.target.style.top = '0px';
        e.target.style.color = 'white';
        e.target.style.backgroundColor = 'rgba(0,0,0,0)';
    }
})