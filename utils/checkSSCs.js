/*
 # Copyright (C) Pedro G. Bascoy
 # This file is part of pegjs-ssc-parser <https://github.com/piulin/pegjs-ssc-parser>.
 #
 # pegjs-ssc-parser is free software: you can redistribute it and/or modify
 # it under the terms of the GNU General Public License as published by
 # the Free Software Foundation, either version 3 of the License, or
 # (at your option) any later version.
 #
 # pegjs-ssc-parser is distributed in the hope that it will be useful,
 # but WITHOUT ANY WARRANTY; without even the implied warranty of
 # MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 # GNU General Public License for more details.
 #
 # You should have received a copy of the GNU General Public License
 # along with pegjs-ssc-parser. If not, see <http://www.gnu.org/licenses/>.
 *
 */


/* USAGE: node checkSSCs.js <songsFolderPath> */


const fs = require('fs') ;
const glob = require('glob');
const peg = require("pegjs");

const args = process.argv.slice(2);
const directory = args[0] ;
const grammarContent = fs.readFileSync('../grammar/SSC.pegjs', 'utf-8');
let parser = peg.generate(grammarContent);

glob(directory + '/**/*.ssc', {}, (err, files)=>{
    for (const file of files) {
        console.log("Parsing file: ", file) ;
        const sscContent = fs.readFileSync(file, 'utf-8');
        try {
            let a = parser.parse(sscContent);
        } catch (e) {
            console.log(e) ;
            break ;
        }
    }
})