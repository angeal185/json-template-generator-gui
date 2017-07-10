var $schema = document.getElementById('schema');
var $schema2 = document.getElementById('schema');
var $schema3 = document.getElementById('schema');

var $output = document.getElementById('output');
var $editor = document.getElementById('editor');
var $validate = document.getElementById('validate');

var $set_schema_button = document.getElementById('setschema');
var $set_schema_button2 = document.getElementById('setschema2');
var $set_schema_button3 = document.getElementById('setschema3');

var $set_value_button = document.getElementById('setvalue');

var jsoneditor;

var reload = function(keep_value) {
    var startval = (jsoneditor && keep_value) ? jsoneditor.getValue() : window.startval;
    window.startval = undefined;

    if (jsoneditor) jsoneditor.destroy();
    jsoneditor = new JSONEditor($editor, {
        schema: schema,
        startval: startval
    });
    window.jsoneditor = jsoneditor;
    jsoneditor.on('change', function() {
        var json = jsoneditor.getValue();

        $output.value = JSON.stringify(json, null, 2);

        var validation_errors = jsoneditor.validate();
        if (validation_errors.length) {
            $validate.value = JSON.stringify(validation_errors, null, 2);
        } else {
            $validate.value = 'valid';
        }

    });
};

$schema.value = JSON.stringify(Post, null, 2);
schema = JSON.parse($schema3.value);

$output.value = '';

$set_value_button.addEventListener('click', function() {
    jsoneditor.setValue(JSON.parse($output.value));
});

$set_schema_button.addEventListener('click', function() {
    try {
        schema = JSON.parse($schema.value);
    } catch (e) {
        alert('Invalid Schema: ' + e.message);
        return;
    }

    reload();
});

//Item
$set_schema_button2.addEventListener('click', function() {
    try {
		$schema2.value = JSON.stringify(Item, null, 2);
        schema = JSON.parse($schema2.value);
    } catch (e) {
        alert('Invalid Schema: ' + e.message);
        return;
    }

    reload();
});

//post
$set_schema_button3.addEventListener('click', function() {
    try {
		$schema3.value = JSON.stringify(Post, null, 2);
        schema = JSON.parse($schema3.value);
    } catch (e) {
        alert('Invalid Schema: ' + e.message);
        return;
    }

    reload();
});

//theme
var setTheme = function(theme, no_reload) {
    theme = theme || '';

    var mapping = {
        bootstrap3: '//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
        slate: '//maxcdn.bootstrapcdn.com/bootswatch/3.3.7/slate/bootstrap.min.css',
        cosmo: '//maxcdn.bootstrapcdn.com/bootswatch/3.3.7/cosmo/bootstrap.min.css',
        darkly: '//maxcdn.bootstrapcdn.com/bootswatch/3.3.7/darkly/bootstrap.min.css',
        paper: '//maxcdn.bootstrapcdn.com/bootswatch/3.3.7/paper/bootstrap.min.css',
        readable: '//maxcdn.bootstrapcdn.com/bootswatch/3.3.7/readable/bootstrap.min.css',
        sandstone: '//maxcdn.bootstrapcdn.com/bootswatch/3.3.7/sandstone/bootstrap.min.css',
        solar: '//maxcdn.bootstrapcdn.com/bootswatch/3.3.7/solar/bootstrap.min.css',
        spacelab: '//maxcdn.bootstrapcdn.com/bootswatch/3.3.7/spacelab/bootstrap.min.css',
        superhero: '//maxcdn.bootstrapcdn.com/bootswatch/3.3.7/superhero/bootstrap.min.css',
        yeti: '//maxcdn.bootstrapcdn.com/bootswatch/3.3.7/yeti/bootstrap.min.css',
        cerulean: '//maxcdn.bootstrapcdn.com/bootswatch/3.3.7/cerulean/bootstrap.min.css'
    };

    if (typeof mapping[theme] === 'undefined') {
        theme = 'darkly';
        document.getElementById('theme_switcher').value = theme;
    }

    JSONEditor.defaults.options.theme = theme;

    document.getElementById('theme_stylesheet').href = mapping[theme];
    document.getElementById('theme_switcher').value = JSONEditor.defaults.options.theme;

    if (!no_reload) reload(true);
};

//icon
var setIconlib = function(iconlib, no_reload) {
    iconlib = iconlib || '';
    JSONEditor.defaults.options.iconlib = iconlib;
    document.getElementById('icon_stylesheet').href = '//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.0.3/css/font-awesome.css';
};

var refreshBooleanOptions = function(no_reload) {
    var boolean_options = document.getElementById('boolean_options').children;
    for (var i = 0; i < boolean_options.length; i++) {
        JSONEditor.defaults.options[boolean_options[i].value] = boolean_options[i].selected;
    }
    if (!no_reload) reload(true);
};

document.getElementById('theme_switcher').addEventListener('change', function() {
    setTheme(this.value);
});

document.getElementById('object_layout').addEventListener('change', function() {
    JSONEditor.defaults.options.object_layout = this.value;
    reload(true);
});
document.getElementById('show_errors').addEventListener('change', function() {
    JSONEditor.defaults.options.show_errors = this.value;
    reload(true);
});

setTheme((window.location.href.match(/[?&]theme=([^&]+)/) || [])[1] || 'darkly', true);

setIconlib((window.location.href.match(/[?&]iconlib=([^&]*)/) || [null, 'fontawesome4'])[1], true);

document.getElementById('object_layout').value = (window.location.href.match(/[?&]object_layout=([^&]+)/) || [])[1] || 'normal';
JSONEditor.defaults.options.object_layout = document.getElementById('object_layout').value;

document.getElementById('show_errors').value = (window.location.href.match(/[?&]show_errors=([^&]+)/) || [])[1] || 'interaction';
JSONEditor.defaults.options.show_errors = document.getElementById('show_errors').value;

reload();

//save
function saveJson(){
  var text = document.getElementById("output").value;
  var filename = document.getElementById("input-fileName").value;
  var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
  saveAs(blob, filename + ".json");
}

function saveSchema(){
  var text = document.getElementById("schema").value;
  var filename = document.getElementById("schema-fileName").value;
  var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
  saveAs(blob, filename + ".json");
}

//modal
var mdlModal = document.getElementById('modelDiv');
var mdlButton = document.getElementById('modelBtn');

var open = function() {
  mdlModal.style.display = 'block';
  mdlButton.style.opacity = '0';
};

mdlButton.addEventListener('click', open, false);

function closeMdl(){
	mdlModal.style.display = 'none';
   mdlButton.style.opacity = '1';
}
//timestampgen
(function() {
  var $, $result, $text, error, obj;

  $ = document.querySelector.bind(document);

  $text = $('#timestampGen');

  $result = $('.result');

  obj = {
    f_convert_date: function(ts) {
      var date, exd;
      exd = new Date(ts.slice(0, 10) / 1000);
      date = {
        d: exd.getDate() < 10 ? '0' + exd.getDate() : exd.getDate(),
        m: exd.getMonth() < 9 ? '0' + exd.getMonth() + 1 : exd.getMonth() + 1,
        y: exd.getFullYear()
      };
      return date.d + '/' + date.m + '/' + date.y;
    },
    f_reverse: function(str) {
      var str;
      str = str.replace(/-|_|\/|[\s\.]/g, '-').split('-').reverse().join('-');
      return new Date(str).valueOf() / 1000;
    }
  };

  error = {
    length: 'LENGTH ERROR',
    type: 'INPUT TYPE ERROR'
  };

  $text.oninput = function() {
    var data;
    data = this.value.trim();
    if (data.match(/^\d+$/g)) {
      $result.innerHTML = obj.f_convert_date(data);
    } else if (data.match(/-|_|\/|[\s\.]/g)) {
      $result.innerHTML = obj.f_reverse(data);
    }
  };

}).call(this);