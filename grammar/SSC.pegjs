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

start
    = _ header:header levels:level* {
        return {
            'header': header,
            'levels': levels
        } ;
    }


ws "whitespace"
    = [ \t\n\r]*

end_line
    = [\n\r\u2028\u2029]

EOF
  = !.

comment
    = "//" (!end_line .)*

_
    = ws (comment ws)*

end_sentence
    = _ ";" _

key_value_separator
    = _ ":" _

composition_separator
    = _ "," _

item_separator
    = _ ("="/":") _

valid_char
    = [^;:=,\n/]
string
    = valid_char* (!"//" "/" valid_char*)*  { return text().trim() ; }

integer
    = num: [0-9]+ { return num.join("") ; }

float_a
    = integer:integer "." { return integer ; }

float_b
    = number:integer? "." decimal:integer {
        number = number === null ? '0' : number ;
        return number+"."+decimal ;
    }
unsigned_number
    = float_b / float_a / integer

number
    =  sign:[+-]? unsigned_number:unsigned_number {
        sign = sign === null ? '' : sign ;
        return parseFloat(sign+unsigned_number) ;
    }

key
    = "#" string:string { return string ; }

item
    = number:(
        !([+-]?[0-9]*("."[0-9]*)? [^0-9,=;:\n\r]) number:number { return number ; }
    ) / string:string

composition
    = items:(
        item:item item_separator { return item ; }
    )* lastItem:item {
        let allItems = items.concat(lastItem) ;
        return allItems.length > 1 ? allItems : allItems[0] ;
     }

list
    = compositions:(
        composition:composition composition_separator { return composition ; }
    )* lastComposition:composition {
        compositions.push(lastComposition) ;
        return compositions.length > 1 ? compositions : compositions[0] ;
    }

value
    = list

notedata_literal
    = "#NOTEDATA:;"

notes_literal
    = "#NOTES:"

entry
    = !notedata_literal !notes_literal key:key key_value_separator value:value end_sentence {
        let lastChar = key.slice(-1) ;
        if ( lastChar === 'S' && Array.isArray(value) && !Array.isArray(value[0]) ) {
            return {[key]: [value]};
        }
        return {[key]: value};
    }


notedata_entry
    = &notedata_literal key:key key_value_separator value:value end_sentence { return '' ; }

note_whitespace
    = [ \t&]*

_n
    = note_whitespace (comment note_whitespace)*

note_separator
    = _n [\n\r] _n

valid_note
    = note:[01234567FMxXyY{}|nZzhLvs*BSEIa]

note_item
    = note_separator* notes:valid_note+ note_separator { return notes.join("") ; }
bar
    = note_item*

notes
    = bars:(
            bar:bar composition_separator { return bar ; }
        )* last_bar:bar {
            bars.push(last_bar) ;
            return bars ;
        }

notes_entry
    = &notes_literal key:key key_value_separator value:notes end_sentence {
        let specialNotes = false ;
        for ( let bar of value ) {
            for (let notes of bar) {
                for (let i = 0; i < notes.length; i++) {
                    const note = notes.charAt(i);
                    if ( note !== '0' && note !== '1' && note !== '2' && note !== '3' ) {
                        specialNotes = true ;
                        break ;
                    }
                }
            }
        }
        return {[key]: value,
                SPECIALNOTES: specialNotes } ;
    }


header
    = entries:entry* &notedata_entry {
        let header = {} ;
        entries.forEach( (entry) => {
            header = {...header, ...entry } ;
        } ) ;
        return header ;
    }

level
    = notedata_entry entries:(entry / notes_entry)*  {
            let level = {} ;
            entries.forEach( (entry) => {
                level = {...level, ...entry } ;
            } ) ;
            return level ;
        }