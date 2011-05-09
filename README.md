# about:home snippets server switcher

This is a quick-and-dirty addon to manage how the about:home page fetches
snippet content. 

Using this, you can tweak the parameters by which the browser identifies itself
to the snippet service, This allows display of content for other locales,
channels, versions, etc.

This addon will also force a reload of fresh snippet content. which Firefox
will otherwise only check once every 24 hours.

See also:

* <https://wiki.mozilla.org/Firefox/Projects/Firefox_Start/Snippet_Service>

## TODO

* Should this be merged into home-snippets-server project?
    * <https://github.com/lmorchard/home-snippets-server>

* More feedback on what actually gets loaded from service?

* Make this friendlier overall

* Support out-of-box and user-managed presets in a drop-down, eg:
    * Browser defaults
    * Prod / staging / dev
    * Staging, ja locale, aurora channel

* To assist in choices, make most fields combo drop-down / free-form text fields.
    * Include %PLACEHOLDER% in each, to use browser actual value
    * Populate base_url from:
        * https://snippets.mozilla.com; https://snippets.stage.mozilla.com, http://localhost:8000
    * Populate name, version, locale from product-details json
    * Populate channel from known channels (ie. release, beta, aurora, nightly)
    * Populate buildid from nightly build products?
    * Source for os_version?
    * Source for distribution, distribution_version?

