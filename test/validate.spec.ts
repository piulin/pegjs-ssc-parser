import fs from 'fs/promises';
import path from 'path';
import { parseSSC, validateSSC } from '../src';

describe('validate', () => {
    it('should parse and validate sample ssc file', async () => {
        const expected = {
            header: {
                version: 0.81,
                title: 'Elvis, The resistance',
                subtitle: null,
                artist: 'AOA',
                titleTranslit: undefined,
                subtitleTranslit: undefined,
                artistTranslit: null,
                genre: null,
                origin: null,
                credit: 'SMSC',
                banner: '1439.png',
                background: '1439-wide.png',
                previewVideo: '1439_P.mpg',
                cdTitle: null,
                music: '1439.mp3',
                offset: -0.281,
                sampleStart: 28.679901,
                sampleLength: 12,
                selectable: 'YES',
                songType: undefined,
                songCategory: undefined,
                volume: undefined,
                BPMs: [[0, 135]],
                timeSignatures: [[0, 4, 4]],
                tickCounts: [[0, 8]],
                combos: [[0, 1]],
                speeds: [[0, 1, 0, 0]],
                scrolls: [[0, 1]],
                delays: [],
                stops: [],
                warps: [],
                labels: [[0, 'Song Start']],
                lastSecondHint: 113.03878,
                backgroundChanges: [
                    [
                        -10000,
                        'black.mpg',
                        1,
                        1,
                        0,
                        1,
                        null,
                        null,
                        'CrossFade',
                        null,
                        null,
                    ],
                    [
                        -0.7,
                        '1439.mpg',
                        1,
                        1,
                        0,
                        0,
                        'StretchNoLoop',
                        null,
                        'CrossFade',
                        null,
                        null,
                    ],
                    [99999, '-nosongbg-', 1, 0, 0, 0],
                ],
            },
            levels: [
                {
                    stepsType: 'pump-single',
                    description: 's2',
                    difficulty: 'Beginner',
                    meter: 2,
                    radarValues: [
                        [
                            0.139123, 0.109218, 0.045507, 0, 0, 102, 5, 0, 0, 0,
                            0, 0, 0, 0.139123, 0.109218, 0.045507, 0, 0, 102, 5,
                            0, 0, 0, 0, 0, 0,
                        ],
                    ],
                    credit: 'SMSC',
                    offset: -0.281,
                    BPMs: [[0, 135]],
                    stops: [],
                    delays: [],
                    warps: [],
                    timeSignatures: [[0, 4, 4]],
                    tickCounts: [[0, 4]],
                    combos: [[0, 1]],
                    speeds: [
                        [0, 1, 0, 0],
                        [0, 1, 0, 0],
                    ],
                    scrolls: [[0, 1]],
                    fakes: null,
                    labels: [[0, 'Song Start']],
                    notes: [
                        [
                            ['0', '0', '0', '0', '0'],
                            ['0', '0', '0', '0', '0'],
                            ['0', '0', '0', '0', '0'],
                            ['0', '0', '0', '0', '0'],
                        ],
                        [
                            ['0', '0', '1', '0', '0'],
                            ['0', '0', '1', '0', '0'],
                            ['0', '0', '0', '0', '1'],
                            ['0', '0', '0', '0', 'M'],
                        ],
                    ],
                    specialNotes: new Set(['M']),
                },
            ],
        };

        const sscContent = await fs.readFile(
            path.join(__dirname, '..', 'ssc-samples', 'test.ssc'),
            'utf-8'
        );

        const parsedSSC = parseSSC(sscContent);
        expect(validateSSC(parsedSSC)).toStrictEqual(expected);
        // var validatedSSC = validateSSC(parsedSSC);
        // console.log(validatedSSC);
    });
});
