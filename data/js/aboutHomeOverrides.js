/**
 * Page-mod hacks to override about:home behavior
 */
onMessage = function (event) {
    if (event.update_url) {
        delete localStorage['snippets-last-update'];
        localStorage["snippets-update-url"] = event.update_url;
        console.log("UPDATE URL " + event.update_url);
    }
}
