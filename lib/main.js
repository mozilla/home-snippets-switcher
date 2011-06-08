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

const {Cc,Ci,Cr,Cu} = require("chrome");
const {Services} = Cu.import("resource://gre/modules/Services.jsm");

exports.main = function (options, callbacks) {

    // Stash the original value of the pref, before we start monkeying with it.
    if ('undefined' == typeof(simpleStorage.storage.original_update_url)) {
        simpleStorage.storage.original_update_url = 
            preferences.get('browser.aboutHomeSnippets.updateUrl');
    }

    // Set up a page mod to make tweaks to about:home
    pageMod.PageMod({
        include: 'about:home',
        contentScriptFile: [
            data.url('js/aboutHomeOverrides.js'),
        ],
        contentScriptWhen: 'start',
        onAttach: function (worker) {
            const STARTPAGE_VERSION = 1;
            let updateURL = preferences.get(PREF_UPDATE_URL)
                .replace("%STARTPAGE_VERSION%", STARTPAGE_VERSION);
            updateURL = Services.urlFormatter.formatURL(updateURL);
            worker.postMessage({ update_url: updateURL });
        }
    });

    // Install a widget in the addon bar to summon update URL settings
    var widget = widgets.Widget({
	id: "home-snippets-switcher",
	label: "Manage snippets updates",
        content: 'SNIPPETS!',
        width: 100,
        panel: panel.Panel({
            width: 350, height: 750,
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
        case 'restore_update_url':
            preferences.set(PREF_UPDATE_URL, simpleStorage.storage.original_update_url);
            worker.postMessage({ 
                type: 'receive_update_url', 
                update_url: preferences.get(PREF_UPDATE_URL)
            });
            openHome();
            break;
        case 'set_update_url':
            preferences.set(PREF_UPDATE_URL, event.update_url);
            openHome();
            break;
        case 'open_about_home':
            openHome();
            break;
        default:
            break;
    }
}

function openHome (background) {
    for each (var tab in tabs) {
        if (tab.url == 'about:home') { tab.close(); }
    }
    tabs.open({ url: 'about:home' });
}
