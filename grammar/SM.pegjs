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

{
    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function getSpecialNotes(bars) {
        let specialNotes = new Set() ;
        for ( let bar of bars ) {
            for (let notes of bar) {
                for (let i = 0; i < notes.length; i++) {
                    const note = notes[i];
                    if ( note !== '0' && note !== '1' && note !== '2' && note !== '3' ) {
                        if ( typeof note === 'object' ) {
                            // check if note is dictionary
                            if( Object.keys(note).length > 0 ) {
                                // iterate keys and values
                                if (note.attribute === 'v') {
                                    specialNotes.add('V') ;
                                } else if (note.attribute === 's') {
                                    specialNotes.add('S') ;
                                } else if (note.attribute === 'h') {
                                    specialNotes.add('H') ;
                                }
                                if (note.fake === '1') {
                                    specialNotes.add('F') ;
                                }

                            }
                        } else {
                            specialNotes.add(note) ;
                        }
                    }
                }
            }
        }
        return specialNotes ;
    }

    function parseString(str) {

        const val = str.trim() ;
        if ( isNumeric(val) ) {
            return parseFloat(val) ;
        } else if ( val.length == 0 ) {
            return null;
        }
        return val.replace("\\","") ;
    }
}

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
    = "//" (!end_line !semicolon .)*

_
    = ws (comment ws)*

semicolon
    = ";"

end_sentence
    = _ semicolon _

key_value_separator
    = _ ":" _

composition_separator
    = _ "," _

item_separator
    = _ ("="/":") _

valid_char
    = "\\," / "\\;" / "\\:" / "\\=" / [^;:=,\n/]
string
    = valid_char* (!"//" "/" valid_char*)* {
        return parseString(text()) ;
    }

commaed_string
    = (valid_char / ",")* (!"//" "/" valid_char*)* {
        return parseString(text()) ;
    }

key
    = "#" string:string { return string ; }

item
    = string

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

note_symbol
    = [01234567XxYyZzVHFMLK*BSEIa]

// https://github.com/stepmania/stepmania/wiki/Note-Types
compressed_note
    = "{" note:note_symbol* "}" {
        return note ;
    }

stepF2_note
    = "{" type:note_symbol "|" attribute:[nvsh] "|" fake:[01] "|" reserved:. "}" {
        return {
            'type': type,
            'attribute':attribute,
            'fake': fake,
            'reserved': reserved
        } ;
    }

valid_note
    = (!stepF2_note cn:compressed_note {return cn;} )
     / stepF2_note / note_symbol

note_item
    = note_separator* notes:valid_note+ note_separator { return notes ; }
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
    = &notes_literal key:key key_value_separator meta:notes_meta value:notes end_sentence {
        return {
                ...meta,
                [key]: value,
                SPECIALNOTES: getSpecialNotes(value) } ;

        // return {[key]: value } ;
    }

notes_meta
    = style:string key_value_separator stepartist:commaed_string key_value_separator difficulty:string key_value_separator meter:string key_value_separator radar:commaed_string key_value_separator {
        return {
            STEPSTYPE: style,
            CREDIT: stepartist,
            DIFFICULTY: difficulty,
            METER: meter,
            UNKNOWN: radar
            } ;
    }


header
    = entries:entry* &notes_literal {
        let header = {} ;
        entries.forEach( (entry) => {
            header = {...header, ...entry } ;
        } ) ;
        return header ;
    }

level 
    = lvl:notes_entry
    {
        return lvl ;
    }

// level
//     = notedata_entry entries:(entry / notes_entry)*  {
//             let level = {} ;
//             entries.forEach( (entry) => {
//                 level = {...level, ...entry } ;
//             } ) ;
//             return level ;
//         }