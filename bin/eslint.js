#!/usr/bin/env node

process.title = "eslint";

var cli = require("../lib/cli");
cli.execute(Array.prototype.slice.call(process.argv, 2), function(exitCode){
    process.exit(exitCode);
});

