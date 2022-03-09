## PEGJS Javascript SSC Parser

In this repository you will find all the software necessary to parse SSC files directly in your web application. It includes:
1. A SSC parser that works directly on your favourite browser (client side)
2. A SSC parser as a Nodejs module for your backend
3. A PEG grammar definition to parse SSC files (so you can fine-tune it for your specific application)
4. An utility to check the correctness of your favourite SSC files

## SSC file format

The SSC format is a chart format created for Stepmania 5. It defines the necessary information
to draw and play a stage for multiple dance styles, including Dance Dance Revolution, In The Groove and Pump It Up.
The SSC file is an evolution of the old-fashioned SM files, allowing to include advanced timing data such as per-chart timing data,
delays, warps, scroll speed, fake sections, and more.

### SSC Sections

Within SSC files, we can identify two separate sections:

1. Header: It appears in first place and defines global attributes of the chart, such as the title, the version or the artist. It
consists of dictionary-like entries following the format:
```
#<TAG>:<VALUE>;
```
where `TAG` is a string and `VALUE` can take a number of shapes, depending on the specific attribute.

2. Note data section: It appears right after the `#NOTEDATA:;` literal. It contains the specific entries for a level including
the level's note definitions.

To learn more about the tags and their values, have a look at the [official stepmania SSC wiki](https://github.com/stepmania/stepmania/wiki/ssc).

## Toy SSC file

In the following lines you will see the contents of a toy SSC file that will serve to see the output of parser. This SSC is well-formed, so it contain no errors and will sucessfully parse. For obvious reasons, the NOTES entry has been kept minimal.
```
#VERSION:0.81;
#TITLE:Elvis;
#SUBTITLE:;
#ARTIST:AOA;
#TITLETRANSLIT:1439;
#SUBTITLETRANSLIT:;
#ARTISTTRANSLIT:;
#GENRE:;
#ORIGIN:;
#CREDIT:SMSC;
#BANNER:1439.png;
#BACKGROUND:1439-wide.png;
#PREVIEWVID:1439_P.mpg;
#CDIMAGE:;
#DISCIMAGE:;
#LYRICSPATH:;
#CDTITLE:;
#MUSIC:1439.mp3;
#OFFSET:-0.281000;
#SAMPLESTART:28.679901;
#SAMPLELENGTH:12.000000;
#SELECTABLE:YES;
#DISPLAYBPM:135.000000;
#BPMS:0.000=135.000;
#STOPS:;
#DELAYS:;
#WARPS:;
#TIMESIGNATURES:0.000=4=4;
#TICKCOUNTS:0.000=8;
#COMBOS:0.000=1;
#SPEEDS:0.000=1.000=0.000=0;
#SCROLLS:0.000=1.000;
#FAKES:;
#LABELS:0.000=Song Start;
#LASTSECONDHINT:113.038780;
#BGCHANGES:-10000.000=black.mpg=1.000=1=0=1===CrossFade==,
-0.700=1439.mpg=1.000=1=0=0=StretchNoLoop==CrossFade==,
99999=-nosongbg-=1.000=0=0=0 // don't automatically add -songbackground-
;
#KEYSOUNDS:;
#ATTACKS:
  TIME=14.65:LEN=5.00:MODS=test;
//---------------pump-single - s2----------------
#NOTEDATA:;
#CHARTNAME:;
#STEPSTYPE:pump-single;
#DESCRIPTION:s2;
#CHARTSTYLE:;
#DIFFICULTY:Beginner;
#METER:2;
#RADARVALUES:0.139123,0.109218,0.045507,0.000000,0.000000,102.000000,5.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.139123,0.109218,0.045507,0.000000,0.000000,102.000000,5.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000;
#CREDIT:SMSC;
#OFFSET:-0.281000;
#BPMS:0.000000=135.000000
;
#STOPS:;
#DELAYS:;
#WARPS:;
#TIMESIGNATURES:0.000000=4=4
;
#TICKCOUNTS:0.000000=4
;
#COMBOS:0.000000=1
;
#SPEEDS:0.000000=1.000000=0.000000=0,
0.000000=1.000000=0.000000=0
;
#SCROLLS:0.000000=1.000000
;
#FAKES:;
#LABELS:0.000=Song Start;
#ATTACKS:TIME=14.65:LEN=5.00:MODS=test:TIME=14.65:LEN=5.00:MODS=test:TIME=14.65:LEN=5.00:MODS=test:TIME=14.65:LEN=5.00:MODS=test:TIME=14.65:LEN=5.00:MODS=test:TIME=14.65:LEN=5.00:MODS=test;
#DISPLAYBPM:135.000000;
#NOTES:
00000
00000
00000
00000
,
00100
00100
00001
0000M
;
```

## Parser parse

A parse is a dictionary with the following structure

```javascript
{
  header: {...},
  levels: [...]
}
```

where the value of `header` is a dictionary containing all entries found in the header section, whereas the value of `levels` is an array of dictionaries containing all entries for each level (i.e. each `#NOTEDATA:;` section) defined in the SSC file.

The actual values of each entry depend only on their content:
1. Single-valued entries in the SSC definition, e.g. `#TITLE:Elvis;` and `#OFFSET:-0.281000;`, will translate into single-valued values in the resulting dictionary, namely:
```javascript
{
      header: {
            TITLE: "Elvis",
            OFFSET: -0.281,
            ...
      },
      levels: [...]
}
```
2. On the other hand, multivalued entries in the SSC definition, e.g.
```
 #SPEEDS:0.000000=1.000000=0.000000=0,
 0.000000=1.000000=0.000000=0
 ;
```
will translate into array-shaped values in the resulting dictionary. Separator `,` creates the first level array, whilst separators `=` and `:` create last level:
```javascript
{
      header: {
            SPEEDS: [ [ 0, 1, 0, 0 ], [ 0, 1, 0, 0 ] ],
            ...
      },
      levels: [...]
}
```

3. The `#NOTES` entry is shaped as an array of arrays, where the first layer consists of all bars, and the second layer 
has the notes for each bar. The possible note symbols in this entry, as defined in the grammar, are the following: `[01234567XxYyZzVHFMLK*BSEIa]`. 
I don't really know what [these symbols](https://github.com/stepmania/stepmania/wiki/Note-Types) stand for besides `0`, `1`, `2`, and `3`. The parse of this entry with the content 
of the previous toy example results in the following dictionary:
```javascript
{
      header: {...},
      levels: [{
                ...,
                NOTES: [
                        [
                            [ '0', '0', '0', '0', '0' ],
                            [ '0', '0', '0', '0', '0' ],
                            [ '0', '0', '0', '0', '0' ],
                            [ '0', '0', '0', '0', '0' ]
                        ],
                        [
                            [ '0', '0', '1', '0', '0' ],
                            [ '0', '0', '1', '0', '0' ],
                            [ '0', '0', '0', '0', '1' ],
                            [ '0', '0', '0', '0', 'M' ]
                        ]
                ],
                SPECIALNOTES: true
      }]
}
```
This parser is also capable of parsing StepF2 special notes, which follow the syntax `{<type>|<attribute>|<fake>|<reserved>}`. 
In such case, the content of the specific note is a dictionary with the following structure:
```javascript
{ 
  type: ..., 
  attribute: ..., 
  fake: ..., 
  reserved: ...
}
```
There are other type of notes that take the shape of a string enclosed by braces, e.g. `{10a}`. These are parsed as an array with its
contents, namely `[ '1', '0', 'a' ]`.
To illustrate what is the parse when dealing with these kinds of notes, say that we have a `#NOTES` section with the following content:
```
#NOTES:
{1|v|1|0}00000000{1|v|1|0}
0{1|v|1|0}000000{1|v|1|0}0
00{10a}0{10a}{10a}0{10a}00
;
```
The resulting parse of this section will be as follows:
```javascript
[
  [
    { type: '1', attribute: 'v', fake: '1', reserved: '0' },
    '0',
    '0',
    '0',
    '0',
    '0',
    '0',
    '0',
    '0',
    { type: '1', attribute: 'v', fake: '1', reserved: '0' }
  ],
  [
    '0',
    { type: '1', attribute: 'v', fake: '1', reserved: '0' },
    '0',
    '0',
    '0',
    '0',
    '0',
    '0',
    { type: '1', attribute: 'v', fake: '1', reserved: '0' },
    '0'
  ],
  [
    '0',
    '0',
    [ '1', '0', 'a' ],
    '0',
    [ '1', '0', 'a' ],
    [ '1', '0', 'a' ],
    '0',
    [ '1', '0', 'a' ],
    '0',
    '0'
  ]
]
```

Finally, note that a special entry in the dictionary `SPECIALNOTES` is created after parsing (not included in the SSC file). 
Its value is a `Set` including all note symbols different than `0`, `1`, `2`, or `3`. When StepF2 notes are seen, the literal
`StepF2` is added to the set.

### Error handling

A malformed SSC file will throw a parsing exception at parsing time. The exception details where the parsing error has occured. When a parsing error occurs, no parse is generated.

## How to use the parser

### On the browser

If you want to use it from your browser, just include the file `parsers/SSCParserClient.js` as a script in your HTML document.
```HTML
<script src="parser/SSCParserClient.js"></script>
```
A global object `sscParser` will be available. You can use its `parse(sscContent: str)` method to obtain the parse tree.
```javascript
const sscContent = ... ;
let parse = sscParser.parse(sscContent) ;
```

### On Nodejs

Just import the file `parsers/SSCParser.js` and use the same procedure as described for the browsers.

```javascript
const sscParser = require("./parser/SSCParser") ;
const sscContent = ... ;
let parse = sscParser.parse(sscContent) ;
```

## Fine-tuning the grammar

If you think that the parser does not fulfills your needs as is, you can tune the grammar that generates the parser for your specific application. The PEG grammar definition is available in the file `grammar/SSC.pegjs`.

Make sure that you create the associated files under `parsers/` after any modification. You can do it running the script `utils/exportSSCParser.sh` if you have `pegjs` installed in your system. You can learn more about the grammar syntax and `pegjs` [here](https://pegjs.org/).

## Checking the correctness of your SSC files

In this repository also bundles a small utility that will check that the SSC files in your STEPMANIA Song folder are correct. You can find it in `utils/checkSSCs.js`.

The command-line syntax is the following:
```bash
checkSSCs.js <songsFolderPath>
```
where `songsFolderPath` is the path containing all the songs with its associated SSC files. Another files can be present but they will be disregarded.

To run this utility make sure to have the modules `glob` and `pegjs` installed in your system. You can use `npm` to do so.

## License

This project is licensed under the terms of the GPL-3.0 license.
