#!/usr/bin/env bash
pegjs -o parser/SSCParser.js grammar/SSC.pegjs
pegjs -o parser/SSCParserClient.js -e sscParser --format globals grammar/SSC.pegjs

cat COPYRIGHT_NOTICE.md parser/SSCParser.js > temp && mv temp parser/SSCParser.js
cat COPYRIGHT_NOTICE.md parser/SSCParserClient.js > temp && mv temp parser/SSCParserClient.js
