import Mosaic from 'mosaic-framework';

export default new Mosaic({
    name: 'toast-alert',
    element: 'toasts',
    received(info) {
        if(info.color) this.style.backgroundColor = info.color;
    },
    closeToast() {
        this.classList.add('toast-alert-out');
        setTimeout(() => this.remove(), 500);
    },
    created() {
        this.setAttribute('aria-live', 'assertive');
    },
    view() {
        return html`${this.descendants}`
    }
});