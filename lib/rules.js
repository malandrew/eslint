/**
 * @fileoverview Main CLI object.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Privates
//------------------------------------------------------------------------------

var rules = Object.create(null),
    loadRules = require("./load-rules"),
    installRules = require("./install-rules");

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------
function define(ruleId, ruleModule) {
    rules[ruleId] = ruleModule;
}

function load(rulesDir) {
    var newRules = loadRules(rulesDir);
    Object.keys(newRules).forEach(function(ruleId) {
        //ruleId = "eslint" + ruleId;
        define(ruleId, newRules[ruleId]);
    });
}

function install(config) {
    var rules = Object.keys(config.rules);
    var ruleSlugs = rules.map(function(rule) {
        return [rule, "@", "master"].join("");
    });
    installRules(ruleSlugs);
}

exports.load = load;

exports.install = install;

exports.get = function(ruleId) {
    //if (ruleId.indexOf("/") === -1) {
    //    ruleId = "eslint/" + ruleId;
    //}
    return rules[ruleId];
};

exports.define = define;

//------------------------------------------------------------------------------
// Initialization
//------------------------------------------------------------------------------

// loads built-in rules
load();
