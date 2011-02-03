var Options = (function () {

    var $this = {

        update_url: null,

        fields: [
            'base_url', 'startpage_version', 'name', 'version', 'appbuildid',
            'build_target', 'locale', 'channel', 'os_version', 'distribution',
            'distribution_version'
        ],

        init: function () {
            $(document).ready($this.ready);
            return this;
        },

        ready: function () {
            $this.createFields();
            $('#option_controls').submit(function () { return false; });
            $('#option_controls .change').click(function () {
                var url = $this.unparseUrlFields($this.extractFields());
                console.log(url);
                return false;
            });
            postMessage({ type: 'fetch_update_url' });
        },

        onMessage: function (event) {
            switch (event.type) {
                case 'receive_update_url':
                    $this.update_url = event.update_url;
                    var fields = $this.parseUrlFields($this.update_url);
                    $this.updateFields(fields);
                    break;
            };
        },

        createFields: function () {
            $('#option_controls ul li:not(.template)').remove();
            var tmpl = $('#option_controls li.template');
            var ul = $('#option_controls ul');

            for (var i=0, name; name=$this.fields[i]; i++) {
                tmpl.cloneTemplate({
                    'label': name,
                    'input @name': name
                }).appendTo(ul);
            }
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
