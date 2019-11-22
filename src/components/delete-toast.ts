import Mosaic, { html } from 'mosaic-framework';

import * as Globals from '../util/Globals';


export default Mosaic({
    name: 'delete-toast',
    element: 'toasts',
    data: {
        label: '',
        confirm: () => {},
    },
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
        const { label } = this.data;
        return html`
        ${label}
        <br>
        <round-button color='crimson' onclick='${this.handleConfirm}'>Yes, delete</round-button>
        <round-button color='gray' onclick='${this.handleCancel}'>No, cancel</round-button>
        `
    },
    handleConfirm() {
        if(this.data.confirm)
            this.data.confirm();
    },
    handleCancel() {
        Globals.hideAlert();
    }
});