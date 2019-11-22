import Mosaic, { html } from 'mosaic-framework';

export default Mosaic({
    name: 'toast-alert',
    element: 'toasts',
    received(info) {
        if(info.color) this.style.backgroundColor = info.color;
    },
    closeToast(time = 500) {
        this.classList.add('toast-alert-fade-out');
        setTimeout(() => this.remove(), time);
    },
    created() {
        this.setAttribute('aria-live', 'assertive');
    },
    view() {
        return html`${this.descendants}`
    }
});