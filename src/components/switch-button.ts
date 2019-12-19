import Mosaic, { html } from 'mosaic-framework';

// A switch button that can be used to toggle between two different states.
export default Mosaic({
    name: 'switch-button',
    useShadow: true,
    data: {
        on: true,
        knobColorOn: 'lightgray',
        knobColorOff: 'lightgray',
        backgroundColorOn: '#60A4EB',
        onToggle: (() => {})
    },
    created() {
        this.configureSwitchColor();

        this.setAttribute('tabindex', '0');
        this.addEventListener('click', this.toggleSwitch);
    },
    willDestroy() {
        this.removeEventListener('click', this.toggleSwitch);
    },
    toggleSwitch() {
        this.data.on = !this.data.on;

        // Get the children of this element. I'm sure this can be done in
        // a better way, but the shadow dom is still pretty new to me.
        this.configureSwitchColor();

        // The function to run when this switch button is toggled.
        this.data.onToggle(this.data.on);
    },
    configureSwitchColor() {
        const ball = Array.from(this.shadowRoot.childNodes).find(node => {
            return (node as any).nodeName === 'DIV';
        });
        const text = Array.from(this.shadowRoot.childNodes).find(node => {
            return (node as any).nodeName === 'SPAN';
        });

        if(this.data.on === true) {
            this.style.backgroundColor = this.data.backgroundColorOn;
            this.style.borderColor = 'cornflowerblue';
            if(ball) {
                (ball as any).style.marginLeft = '35px';
                (ball as any).style.backgroundColor = this.data.knobColorOn;
            }
            if(text) {
                (text as any).style.marginLeft = '8px';
                (text as any).style.color = 'white';
            }
        } else {
            this.style.backgroundColor = 'transparent';
            this.style.borderColor = 'darkgray';
            if(ball) {
                (ball as any).style.marginLeft = '2px';
                (ball as any).style.backgroundColor = this.data.knobColorOff;
            }
            if(text) {
                (text as any).style.marginLeft = '32px';
                (text as any).style.color = 'gray';
            }
        }
    },
    view() {
        return html`
            <style>
                :host {
                    position: relative;
                    width: 60px;
                    height: 25px;
                    cursor: pointer;
                    border-radius: 25px;
                    display: inline-block;
                    transition-duration: 0.2s;
                    border: 1px solid darkgray;
                }

                div {
                    position: relative;
                    top: 1px;
                    z-index: 1;
                    width: 23px;
                    height: 23px;
                    display: block;
                    margin-left: 2px;
                    border-radius: 100%;
                    transition-duration: 0.5s;
                    background-color: lightgray;
                }

                span {
                    position: absolute;
                    top: 5px;
                    z-index: 0;
                    color: gray;
                    display: block;
                    font-size: 12px;
                    font-weight: 300;
                    margin-left: 32px;
                    transition-duration: 0.5s;
                }
            </style>
            <div aria-hidden='true' class='switch-circle'></div>
            <span aria-hidden='true'>${this.data.on ? "Yes" : "No"}</span>
        `
    }
});