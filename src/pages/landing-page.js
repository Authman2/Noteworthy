import Mosaic from 'mosaic-framework';

export default new Mosaic({
    name: 'landing-page',
    view() {
        return html`
        <div class='top-bar'></div>
        <h1>Noteworthy</h1>
        <h3>Mac | iOS | iPad OS</h3>
        <button onclick='${() => this.router.send('/login')}'>
            Get Started!
        </button>
        `
    }
})