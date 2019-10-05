const packager = require('electron-packager');

function pack() {
    packager({
        dir: __dirname + '/',
        appBundleId: 'com.adeolauthman.noteworthymobile',
        appCategoryType: 'Productivity',
        appCopyright: 'Adeola Uthman 2019',
        appVersion: '2.0.2',
        asar: true,
        buildVersion: '2.0.2',
        executableName: 'Noteworthy',
        icon: __dirname + '/res/NoteworthyLogo.icns',
        name: 'Noteworthy',
        osxSign: true,
        out: '../',
        platform: 'darwin',
        prune: true
    })
    .then(paths => {
        console.log(`Bundled the Noteworthy app to ${paths.join('\n')}`);
    })
    .catch(err => {
        console.log(err);
    });
}
pack();