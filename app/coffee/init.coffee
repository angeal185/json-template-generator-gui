document.getElementById('theme_switcher').innerHTML = json2html.transform(themesData, mainTpl)
document.getElementById('object_layout').innerHTML = json2html.transform(layoutData, mainTpl)
document.getElementById('show_errors').innerHTML = json2html.transform(errorsData, mainTpl)
