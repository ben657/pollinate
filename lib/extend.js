/*  __  __    _    _  _______    ____ _   _    _    _   _  ____ _____ ____  _
   |  \/  |  / \  | |/ / ____|  / ___| | | |  / \  | \ | |/ ___| ____/ ___|| |
   | |\/| | / _ \ | ' /|  _|   | |   | |_| | / _ \ |  \| | |  _|  _| \___ \| |
   | |  | |/ ___ \| . \| |___  | |___|  _  |/ ___ \| |\  | |_| | |___ ___) |_|
   |_|  |_/_/   \_\_|\_\_____|  \____|_| |_/_/   \_\_| \_|\____|_____|____/(_)

   There is a 100% chance that this project can use improvements.
   Pull requests are ALWAYS welcome, even if just amounts to a conversation.  */

var fs = require('fs')
var fileExists = require('file-exists')
var extend = require('extend')
var Hjson = require('hjson');
var pathExtra = require('path-extra');

module.exports = function (state, callback, error) {

    var templateData = {}
    if(fileExists(state.template.tmp + '/template.json')) {
        templateData = Hjson.parse(fs.readFileSync(state.template.tmp + '/template.json', 'utf8'))
        state.template.data = templateData
    }

    // If `~/.pollen` exists then extend with it first
    var userData = {}
    if(fileExists(pathExtra.homedir() + '/.pollen')) {
        userData = Hjson.parse(fs.readFileSync(pathExtra.homedir() + '/.pollen', 'utf8'))
    }

    var projectData = {}
    if(typeof state.project !== 'undefined') {
        if(state.project.source == 'json') {
            projectData = Hjson.parse(state.project.input)
        } else {
            projectData = Hjson.parse(fs.readFileSync(state.project.tmp, 'utf8'))
        }
    }

    // Allow 'options' to override
    var optionData = {}
    if(typeof state.options !== 'undefined') {
        optionData = state.options 
    }

    state.data = extend(true, state.data, templateData, userData, projectData, optionData)

    if(typeof state.data.name == 'undefined') {
        error({ msg: "Please ensure a `name` property is supplied as part of the data." })
        return
    }

    callback(state)
}
