#!/bin/bash

#--------------------------------------------------
# Runs all tests and checks code coverage
#
# Must be run:
# 1. From top-level of project.
# 2. After the tag for the next version is created.
#--------------------------------------------------

# This only works when this script is called directly from root. Once NPM issue
# #3494 is fixed, this will work when calling `npm test` with arguments.
#
# https://github.com/isaacs/npm/issues/3494

if [ -f "$1" ]; then
    testfiles="$1"
else
    testfiles=`find tests/lib/ -name '*.js'`
fi

istanbul=./node_modules/istanbul/lib/cli.js
vows=./node_modules/vows/bin/vows
thresholds='--statement 92 --branch 90 --function 92 --lines 92'

npm run-script lint && node $istanbul cover $vows -- --dot $testfiles && node $istanbul check-coverage $thresholds
