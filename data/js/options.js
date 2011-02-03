var Options = (function () {

    var DEFAULT_PRESETS = [
        ['Production', 'http://snippets.mozilla.com/%STARTPAGE_VERSION%/%NAME%/%VERSION%/%APPBUILDID%/%BUILD_TARGET%/%LOCALE%/%CHANNEL%/%OS_VERSION%/%DISTRIBUTION%/%DISTRIBUTION_VERSION%/'],
        ['Staging', 'http://snippets.stage.mozilla.com/%STARTPAGE_VERSION%/%NAME%/%VERSION%/%APPBUILDID%/%BUILD_TARGET%/%LOCALE%/%CHANNEL%/%OS_VERSION%/%DISTRIBUTION%/%DISTRIBUTION_VERSION%/'],
    ];

    var $this = {

        update_url: null,

        fields: [
            'base_url', 'startpage_version', 'name', 'version', 'appbuildid',
            'build_target', 'locale', 'channel', 'os_version', 'distribution',
            'distribution_version'
        ],

        init: function () {
            $this.presets = JSON.parse(localStorage["presets"])
            if (!$this.presets) {
                $this.presets = DEFAULT_PRESETS; 
                localStorage["presets"] = JSON.stringify($this.presets);
            }
            console.log("PRESETS " + $this.presets.length);

            $(document).ready($this.ready);

            return this;
        },

        ready: function () {
            $this.createFields();
            // TODO: Make this work!
            // $this.createPresets();
            $this.wireUpControls();
            postMessage({ type: 'fetch_update_url' });
        },

        onMessage: function (event) {
            switch (event.type) {
                case 'receive_update_url':
                    $this.update_url = event.update_url;
                    $this.updateFields($this.parseUrlFields($this.update_url));
                    break;
            };
        },

        createFields: function () {
            var url_fields = $('#option_controls ul.url_fields');
            $('li:not(.template)', url_fields).remove();
            var tmpl = $('li.template', url_fields);

            for (var i=0, name; name=$this.fields[i]; i++) {
                tmpl.cloneTemplate({
                    'label': name, 'input @name': name
                }).appendTo(url_fields);
            }
        },

        createPresets: function () {
            var html = '<select name="presets">';
            for (var i=0, pair; pair=$this.presets[i]; i++) {
                html += '<option value="'+pair[1]+'">'+pair[0]+'</option>';
            }
            html += '</select>';
            $('.presets_field li').append(html);
        },

        wireUpControls: function () {

            $('#option_controls').submit(function () { return false; });

            $('#option_controls .open').click(function () {
                postMessage({ type: 'open_about_home' });
                return false;
            });
            
            $('#option_controls .change').click(function () {
                var url = $this.unparseUrlFields($this.extractFields());
                postMessage({ type: 'set_update_url', update_url: url });
                return false;
            });
            
            $('#option_controls .restore').click(function () {
                postMessage({ type: 'restore_update_url' });
                return false;
            });
            
        },

        parseUrlFields: function (url) {
            var parts = url.split('/');
            var base_url = parts[0] + '//' + parts[2];
            var rest = parts.slice(3,13);

            var out = { base_url: base_url };
            for (var i=1, name; name=$this.fields[i]; i++) {
                out[name] = rest.shift();
            }

            return out;
        },

        unparseUrlFields: function (fields) {
            var url = fields['base_url'];
            var parts = [];
            for (var i=1, name; name=$this.fields[i]; i++) {
                parts.push(fields[name]);
            }
            return url + '/' + parts.join('/') + '/';
        },

        updateFields: function (fields) {
            var form = $('#option_controls');
            for (var k in fields) {
                form.find('input[name="'+k+'"]').val(fields[k]);
            }
        },

        extractFields: function () {
            var fields = {};
            var form = $('#option_controls');
            for (var i=0, name; name=$this.fields[i]; i++) {
                fields[name] = form.find('input[name="'+name+'"]').val();
            }
            return fields;
        },

    };
    
    return $this.init();
})();

onMessage = Options.onMessage;
