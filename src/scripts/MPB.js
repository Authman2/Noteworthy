const mpb = document.getElementById('mpb');
const notebookSlider = document.getElementById('notebookSlider');

// Whether or not the notebook slider is open.
var sliderOpen = false;


// Toggle the notebook slider.
mpb.onclick = function() {
    if(sliderOpen) {
        mpb.style.bottom = '30px';
        notebookSlider.style.bottom = '-150px';
        sliderOpen = false;
    } else {
        mpb.style.bottom = '180px';
        notebookSlider.style.bottom = '0px';
        sliderOpen = true;
    }
}