/**
 * @fileoverview Installs rules defined in eslint.json
 * @author Andrew de Andrade
 */

var mkdirp = require("mkdirp"),
    path = require("path"),
    fs = require("fs"),
    request = require("superagent");

// TODO: Should the rules path be ~/.eslint.d/rules instead?
var rulesPath = path.join(__dirname, "..", "rules");
mkdirp.sync(rulesPath);

var baseUrl = "http://localhost:3030";

var files = ["index.js", "test.js"];

function fetchRule(slug) {
    
    var rule = slug.split("@");
    var url = [baseUrl, "eslint", rule[0], rule[1]].join("/");
    var destPath = path.join(rulesPath, "eslint", rule[0], rule[1]);
    
    mkdirp.sync(destPath);
    files.forEach(function(file){
        var dest = path.resolve(destPath, file);
        console.log(dest);
        var req = request.get(url);
        req.set("Accept-Encoding", "identity");
        req.buffer(false);

        req
        .on("end", function(){
            console.log("fetched:", dest);
        })
        .on("error", function(){
            console.log("error fetching:", dest);
        })
        .pipe(fs.createWriteStream(dest))
        .on("error", function(){
            console.log("error writing:", dest);
        });
    });
}

module.exports = function(ruleSlugs) {
    ruleSlugs.map(fetchRule);
    return undefined;
};
