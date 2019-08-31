// Common functionality for buttons.
export default {
    data: {
        icon: '',
        highlightcolor: '#707070'
    },
    created() {
        this.addEventListener('mouseover', this.onHover);
        this.addEventListener('mouseleave', this.onUnhover);
    },
    willDestroy() {
        this.removeEventListener('mouseover', this.onHover);
        this.removeEventListener('mouseleave', this.onUnhover);
    },
    onHover() {
        this.style.color = this.data.highlightcolor;
        this.style.borderColor = this.data.highlightcolor;
    },
    onUnhover() {
        this.style.color = '#707070';
        this.style.borderColor = '#707070';
    }
}