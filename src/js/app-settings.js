const fs = require('fs');
const helpers = require('./helpers.js');
const $ = require('jquery');
const spectrum = require('spectrum-colorpicker');

/** Everything is basically one big function that gets called by the renderer. */
module.exports = (body, titleBar, appSettings, backToHomeFunction) => {

    // 1.) Start by populating the body with the HTML for the settings page.
    // To do this, you will load that file with fs-extra, then place the
    // contents into the innerHTML of the body. Make sure you also clear out
    // whatever is currently there from the last page.
    body.innerHTML = '';
    const loadedPage = fs.readFileSync(__dirname + '/../html/app-settings.html', 'utf8');
    body.innerHTML = titleBar + loadedPage;
    

    /************************
    *                       *
    *       VARIABLES       *
    *                       *
    *************************/

    const tabSizeInput = document.getElementById('chooseTabSizeButton');
    const closeButton = document.getElementById('closeSettingsButton');
    const saveButton = document.getElementById('saveSettingsButton');

    // Load the current settings.
    var tempSettings = Object.assign({}, appSettings);

    // Set the initial value.
    tabSizeInput.value = appSettings['tabSize'];




    /************************
    *                       *
    *       FUNCTIONS       *
    *                       *
    *************************/

    closeButton.onclick = () => {
        for(var i in tempSettings) {
            if(tempSettings[i] !== appSettings[i]) {
                helpers.showPromptDialog('You haven\'t saved the modified settings. Do you still want to close this page?',
                'Continue', 'Cancel', () => {
                    backToHomeFunction();
                });
                return;
            }
        }
        backToHomeFunction();
    }
    saveButton.onclick = () => {
        appSettings = Object.assign({}, tempSettings);

        // Save the new settings, then reload them again to make sure you have the newest one.
        fs.writeFileSync(__dirname + '/../../appSettings.json', JSON.stringify(appSettings), 'utf8');

        backToHomeFunction();
        alertify.success('Updated settings!');
    }


    // Choose color scheme.
    $('#chooseColorSchemeButton').spectrum({
        color: appSettings.colorScheme,
        showInput: true,
        change: function(color) {
            tempSettings['colorScheme'] = color.toRgbString();
        }
    });

    // Choose sidebar text color.
    $('#chooseSidebarTextButton').spectrum({
        color: appSettings.sidebarTextColor,
        showInput: true,
        change: function(color) {
            tempSettings['sidebarTextColor'] = color.toRgbString();
        }
    });
    
    tabSizeInput.onchange = () => {
        tempSettings['tabSize'] = tabSizeInput.value || 0;
    }
};