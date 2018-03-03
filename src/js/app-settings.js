const fs = require('fs');
const helpers = require('./helpers.js');
const $ = require('jquery');
const spectrum = require('spectrum-colorpicker');
const alertify = require('alertify.js');

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
    const resetButton = document.getElementById('resetSettingsButton');

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
                'Continue', 'Cancel', appSettings, () => {
                    backToHomeFunction();
                });
                return;
            }
        }
        backToHomeFunction();
    }
    resetButton.onclick = () => {
        helpers.showPromptDialog('Are you sure you want to set the app settings back to the default?', 'Yes', 'Cancel', appSettings, () => {
            // The default settings.
            const def = {
                mainColorScheme:'rgb(47, 178, 26)',
                noteViewTextColor:'rgba(0, 0, 0, 0.7)',
                noteViewFooterColor:'rgb(88, 158, 106)',
                noteViewRowColor:'#77CC8B',
                tabSize:6
            }
            const str = JSON.stringify(def);
    
            // Save the new settings, then reload them again to make sure you have the newest one.
            fs.writeFileSync(__dirname + '/../../appSettings.json', str, 'utf8');
    
            backToHomeFunction();
            alertify.success('Updated settings!');
        });
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
        color: appSettings.mainColorScheme,
        showInput: true,
        change: function(color) {
            tempSettings['mainColorScheme'] = color.toRgbString();
        }
    });

    // Choose color scheme.
    $('#chooseTextColorButton').spectrum({
        color: appSettings.noteViewTextColor,
        showInput: true,
        change: function(color) {
            tempSettings['noteViewTextColor'] = color.toRgbString();
        }
    });

    // Choose color scheme.
    $('#chooseNoteViewFooterColorButton').spectrum({
        color: appSettings.noteViewFooterColor,
        showInput: true,
        change: function(color) {
            tempSettings['noteViewFooterColor'] = color.toRgbString();
        }
    });

    // Choose color scheme.
    $('#chooseNoteViewRowColorButton').spectrum({
        color: appSettings.noteViewRowColor,
        showInput: true,
        change: function(color) {
            tempSettings['noteViewRowColor'] = color.toRgbString();
        }
    });



    // // Choose sidebar text color.
    // $('#chooseSidebarTextButton').spectrum({
    //     color: appSettings.noteViewTextColor,
    //     showInput: true,
    //     change: function(color) {
    //         tempSettings['noteViewTextColor'] = color.toRgbString();
    //     }
    // });
    
    tabSizeInput.onchange = () => {
        tempSettings['tabSize'] = tabSizeInput.value || 0;
    }
};