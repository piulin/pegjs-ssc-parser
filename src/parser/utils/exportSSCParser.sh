#!/usr/bin/env bash
pegjs -o parser/SSCParser.js grammar/SSC.pegjs
pegjs -o parser/SSCParserClient.js -e sscParser --format globals grammar/SSC.pegjs
