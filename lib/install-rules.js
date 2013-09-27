/**
 * @fileoverview Installs rules defined in eslint.json
 * @author Andrew de Andrade
 */

var mkdirp = require("mkdirp"),
    path = require("path"),
    fs = require("fs"),
    request = require("superagent"),
    Batch = require("batch");

// TODO: Should the rules path be ~/.eslint.d/rules instead?
var rulesPath = path.join(__dirname, "..", "rules");
mkdirp.sync(rulesPath);

var baseUrl = "http://localhost:3030";

var files = ["index.js", "test.js"];

module.exports = function(ruleSlugs) {
    ruleSlugs.map(function(slug) {
        var batch = new Batch();
        var rule = slug.split("@");
        var url = [baseUrl, "eslint", rule[0], rule[1]].join("/");
        var destPath = path.join(rulesPath, "eslint", rule[0], rule[1]);

        batch.concurrency(4);

        mkdirp.sync(destPath);
        files.forEach(function(file){
            batch.push(function(done){
                var destFile = path.resolve(destPath, file);
                var fileUrl = [url, file].join("/");
                //console.warn(destFile, "==>", fileUrl);
                var fstream = fs.createWriteStream(destFile);

                var req = request.get(fileUrl);
                req.set("Accept-Encoding", "identity");
                req.buffer(false);
                req.on("end", done);
                req.on("error", done);
                req.pipe(fstream).on("error", done);
            });
        });

        batch.end();
    });
    return undefined;
};
