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
import { exists } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import glob from 'glob';
import path from 'path';
import { argv } from 'process';
import { parseSSC, validateSSC } from 'src/parser';
import type { Parse } from 'src/parser/types';

const directory = argv[1];
const processedFilePath = path.join(__dirname, 'processed.txt');

const existsPromise = (path: string) =>
    new Promise<boolean>((resolve) => {
        exists(path, (res) => resolve(res));
    });

glob(directory + '/**/*.ssc', {}, async (err: any, files: string[]) => {
    const processed: string[] = [];
    if (await existsPromise(processedFilePath)) {
        const content = await readFile(processedFilePath, 'utf-8');
        (JSON.parse(content) as string[]).forEach((s) => processed.push(s));
    }

    for await (const [file, sscContent] of files
        .filter((path) => !processed.includes(path))
        .map(async (path) => [path, await readFile(path, 'utf-8')])) {
        console.log('Parsing file: ', file);

        try {
            const parse: Parse = parseSSC(sscContent);
            const valParse = validateSSC(parse);
        } catch (e) {
            console.log(e);
            break;
        }
        processed.push(file);
    }

    console.log(`Writing processed files...`);
    await writeFile(processedFilePath, JSON.stringify(processed), 'utf-8');
});
