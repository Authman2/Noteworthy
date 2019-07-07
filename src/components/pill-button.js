import Mosaic from '@authman2/mosaic';

export default new Mosaic({
    name: 'pill-button',
    view() {
        return html`
        <button onpointerdown='${this.touchDown}'
                onpointerup='${this.touchUp}'
                onpointerenter='${this.touchEnter}'
                onpointerout='${this.touchUp}'>
            ${this.data.title || ''}
        </button>
        `
    },
    touchDown(e) {
        e.target.style.color = 'cornflowerblue';
        e.target.style.backgroundColor = 'white';
        if(e.pointerType === 'mouse')
            e.target.style.top = '4px';
    },
    touchUp(e) {
        e.target.style.top = '0px';
        e.target.style.color = 'white';
        e.target.style.backgroundColor = 'rgba(0,0,0,0)';
    },
    touchEnter(e) {
        if(e.pointerType !== 'mouse') return;
        e.target.style.color = 'cornflowerblue';
        e.target.style.backgroundColor = 'white';
    },
    touchLeave(e) {
        if(e.pointerType !== 'mouse') return;
        e.target.style.color = 'white';
        e.target.style.backgroundColor = 'rgba(0,0,0,0)';
    },
})