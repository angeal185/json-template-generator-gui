$schema = document.getElementById('schema')
$schema2 = document.getElementById('schema')
$schema3 = document.getElementById('schema')
$output = document.getElementById('output')
$editor = document.getElementById('editor')
$validate = document.getElementById('validate')
$set_schema_button = document.getElementById('setschema')
$set_schema_button2 = document.getElementById('setschema2')
$set_schema_button3 = document.getElementById('setschema3')
$set_value_button = document.getElementById('setvalue')
jsoneditor = undefined

reload = (keep_value) ->
  startval = if jsoneditor and keep_value then jsoneditor.getValue() else window.startval
  window.startval = undefined
  if jsoneditor
    jsoneditor.destroy()
  jsoneditor = new JSONEditor($editor,
    schema: schema
    startval: startval)
  window.jsoneditor = jsoneditor
  jsoneditor.on 'change', ->
    json = jsoneditor.getValue()
    $output.value = JSON.stringify(json, null, 2)
    validation_errors = jsoneditor.validate()
    if validation_errors.length
      $validate.value = JSON.stringify(validation_errors, null, 2)
    else
      $validate.value = 'valid'
    return
  return

#save

saveJson = ->
  text = document.getElementById('output').value
  filename = document.getElementById('input-fileName').value
  blob = new Blob([ text ], type: 'text/plain;charset=utf-8')
  saveAs blob, filename + '.json'
  return

saveSchema = ->
  text = document.getElementById('schema').value
  filename = document.getElementById('schema-fileName').value
  blob = new Blob([ text ], type: 'text/plain;charset=utf-8')
  saveAs blob, filename + '.json'
  return

closeMdl = ->
  mdlModal.style.display = 'none'
  mdlButton.style.opacity = '1'
  return

$schema.value = JSON.stringify(Post, null, 2)
schema = JSON.parse($schema3.value)
$output.value = ''
$set_value_button.addEventListener 'click', ->
  jsoneditor.setValue JSON.parse($output.value)
  return
$set_schema_button.addEventListener 'click', ->
  try
    schema = JSON.parse($schema.value)
  catch e
    alert 'Invalid Schema: ' + e.message
    return
  reload()
  return
#Item
$set_schema_button2.addEventListener 'click', ->
  try
    $schema2.value = JSON.stringify(Item, null, 2)
    schema = JSON.parse($schema2.value)
  catch e
    alert 'Invalid Schema: ' + e.message
    return
  reload()
  return
#post
$set_schema_button3.addEventListener 'click', ->
  try
    $schema3.value = JSON.stringify(Post, null, 2)
    schema = JSON.parse($schema3.value)
  catch e
    alert 'Invalid Schema: ' + e.message
    return
  reload()
  return
#theme

setTheme = (theme, no_reload) ->
  theme = theme or ''
  mapping = 
    bootstrap3: '//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'
    slate: '//maxcdn.bootstrapcdn.com/bootswatch/3.3.7/slate/bootstrap.min.css'
    cosmo: '//maxcdn.bootstrapcdn.com/bootswatch/3.3.7/cosmo/bootstrap.min.css'
    darkly: '//maxcdn.bootstrapcdn.com/bootswatch/3.3.7/darkly/bootstrap.min.css'
    paper: '//maxcdn.bootstrapcdn.com/bootswatch/3.3.7/paper/bootstrap.min.css'
    readable: '//maxcdn.bootstrapcdn.com/bootswatch/3.3.7/readable/bootstrap.min.css'
    sandstone: '//maxcdn.bootstrapcdn.com/bootswatch/3.3.7/sandstone/bootstrap.min.css'
    solar: '//maxcdn.bootstrapcdn.com/bootswatch/3.3.7/solar/bootstrap.min.css'
    spacelab: '//maxcdn.bootstrapcdn.com/bootswatch/3.3.7/spacelab/bootstrap.min.css'
    superhero: '//maxcdn.bootstrapcdn.com/bootswatch/3.3.7/superhero/bootstrap.min.css'
    yeti: '//maxcdn.bootstrapcdn.com/bootswatch/3.3.7/yeti/bootstrap.min.css'
    cerulean: '//maxcdn.bootstrapcdn.com/bootswatch/3.3.7/cerulean/bootstrap.min.css'
  if typeof mapping[theme] == 'undefined'
    theme = 'darkly'
    document.getElementById('theme_switcher').value = theme
  JSONEditor.defaults.options.theme = theme
  document.getElementById('theme_stylesheet').href = mapping[theme]
  document.getElementById('theme_switcher').value = JSONEditor.defaults.options.theme
  if !no_reload
    reload true
  return

#icon

setIconlib = (iconlib, no_reload) ->
  iconlib = iconlib or ''
  JSONEditor.defaults.options.iconlib = iconlib
  document.getElementById('icon_stylesheet').href = '//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.0.3/css/font-awesome.css'
  return

refreshBooleanOptions = (no_reload) ->
  boolean_options = document.getElementById('boolean_options').children
  i = 0
  while i < boolean_options.length
    JSONEditor.defaults.options[boolean_options[i].value] = boolean_options[i].selected
    i++
  if !no_reload
    reload true
  return

document.getElementById('theme_switcher').addEventListener 'change', ->
  setTheme @value
  return
document.getElementById('object_layout').addEventListener 'change', ->
  JSONEditor.defaults.options.object_layout = @value
  reload true
  return
document.getElementById('show_errors').addEventListener 'change', ->
  JSONEditor.defaults.options.show_errors = @value
  reload true
  return
setTheme (window.location.href.match(/[?&]theme=([^&]+)/) or [])[1] or 'darkly', true
setIconlib (window.location.href.match(/[?&]iconlib=([^&]*)/) or [
  null
  'fontawesome4'
])[1], true
document.getElementById('object_layout').value = (window.location.href.match(/[?&]object_layout=([^&]+)/) or [])[1] or 'normal'
JSONEditor.defaults.options.object_layout = document.getElementById('object_layout').value
document.getElementById('show_errors').value = (window.location.href.match(/[?&]show_errors=([^&]+)/) or [])[1] or 'interaction'
JSONEditor.defaults.options.show_errors = document.getElementById('show_errors').value
reload()
#modal
mdlModal = document.getElementById('modelDiv')
mdlButton = document.getElementById('modelBtn')

open = ->
  mdlModal.style.display = 'block'
  mdlButton.style.opacity = '0'
  return

mdlButton.addEventListener 'click', open, false
#timestampgen
(->
  $ = undefined
  $result = undefined
  $text = undefined
  error = undefined
  obj = undefined
  $ = document.querySelector.bind(document)
  $text = $('#timestampGen')
  $result = $('.result')
  obj =
    f_convert_date: (ts) ->
      date = undefined
      exd = undefined
      exd = new Date(ts.slice(0, 10) / 1000)
      date =
        d: if exd.getDate() < 10 then '0' + exd.getDate() else exd.getDate()
        m: if exd.getMonth() < 9 then '0' + exd.getMonth() + 1 else exd.getMonth() + 1
        y: exd.getFullYear()
      date.d + '/' + date.m + '/' + date.y
    f_reverse: (str) ->
      `var str`
      str = undefined
      str = str.replace(/-|_|\/|[\s\.]/g, '-').split('-').reverse().join('-')
      new Date(str).valueOf() / 1000
  error =
    length: 'LENGTH ERROR'
    type: 'INPUT TYPE ERROR'

  $text.oninput = ->
    data = undefined
    data = @value.trim()
    if data.match(/^\d+$/g)
      $result.innerHTML = obj.f_convert_date(data)
    else if data.match(/-|_|\/|[\s\.]/g)
      $result.innerHTML = obj.f_reverse(data)
    return

  return
).call this