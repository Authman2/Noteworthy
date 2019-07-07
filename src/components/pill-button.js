import Mosaic from '@authman2/mosaic';

export default new Mosaic({
    name: 'pill-button',
    view() {
        return html`
        <button onpointerdown='${this.touchDown}'
                onpointerup='${this.touchUp}'>
            ${this.data.title || ''}
        </button>
        `
    },
    touchDown(e) {
        e.target.style.color = 'cornflowerblue';
        e.target.style.backgroundColor = 'white';
    },
    touchUp(e) {
        e.target.style.color = 'white';
        e.target.style.backgroundColor = 'rgba(0,0,0,0)';
    }
})