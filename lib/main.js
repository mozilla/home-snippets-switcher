const self = require('self');
const data = self.data;
const pageMod = require("page-mod");
const panel = require("panel");
const simpleStorage = require("simple-storage");
const preferences = require("preferences-service");
const widgets = require("widget");
const tabs = require("tabs");

const index_url = data.url('index.html');

const PREF_UPDATE_URL = 'browser.aboutHomeSnippets.updateUrl';

// pref("browser.aboutHomeSnippets.updateUrl", "http://snippets.mozilla.com/%STARTPAGE_VERSION%/%NAME%/%VERSION%/%APPBUILDID%/%BUILD_TARGET%/%LOCALE%/%CHANNEL%/%OS_VERSION%/%DISTRIBUTION%/%DISTRIBUTION_VERSION%/");

exports.main = function (options, callbacks) {

    // Stash the original value of the pref, before we start monkeying with it.
    if ('undefined' == typeof(simpleStorage.storage.original_update_url)) {
        simpleStorage.storage.original_update_url = 
        preferences.get('browser.aboutHomeSnippets.updateUrl');
    }

    pageMod.PageMod({
        include: 'about:home',
        onAttach: function (worker) {
            console.log("ABOUT HOME!");
        }
    });

    var widget = widgets.Widget({
        label: "Mozilla website",
        content: '<img src="http://www.mozilla.org/favicon.ico"/>',
        width: 50,
        panel: panel.Panel({
            width: 350, height: 675,
            contentURL: data.url('options.html'),
            contentScriptFile: [
                data.url('js/jquery-1.5.min.js'),
                data.url('js/jquery.cloneTemplate.js'),
                data.url('js/options.js'),
            ],
            onMessage: function (event) { 
                onPanelMessage(this, event); 
            }
        })
    });

    widget.panel.show();

};

exports.onUnload = function (reason) {

};

function onPanelMessage (worker, event) {
    switch (event.type) {
        case 'fetch_update_url':
            worker.postMessage({ 
                type: 'receive_update_url', 
                update_url: preferences.get(PREF_UPDATE_URL)
            });
            break;
        default:
            break;
    }
}
