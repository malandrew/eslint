var fs = require("fs"),
    path = require("path"),
    file = require("file");

module.exports = function(rulesDir) {
    if (!rulesDir) {
        rulesDir = path.join(__dirname, "rules");
    } else {
        rulesDir = path.resolve(process.cwd(), rulesDir);
    }

    var rules = Object.create(null);

    var newRulesDir = path.join(__dirname, "..", "rules");
    file.walkSync(newRulesDir, function(dirPath, dirs, files){
        var hasFiles = files.length > 0;
        var hasIndexJS = files.indexOf("index.js") !== -1;

        if (hasFiles && hasIndexJS) {
            var relPath = path.relative(newRulesDir, dirPath);
            var ruleName = relPath.split(path.sep).slice(0,2).join("/");
            var rulePath = path.resolve(dirPath, "index.js");
            rules[ruleName] = require(rulePath);
        }
    });

    fs.readdirSync(rulesDir).forEach(function(file) {
        if (path.extname(file) !== ".js") { return; }
        rules[file.slice(0, -3)] = require(path.join(rulesDir, file));
    });
    return rules;
};
