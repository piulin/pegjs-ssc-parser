import {
    DoubleNotes,
    HalfDoubleNotes,
    Parse,
    ParsedAttribute,
    SingleNotes,
} from './types';
import {
    SongTypes,
    StepsType,
    ValidatedHeader,
    ValidatedLevel,
    ValidatedSSC,
    assertNDimensionalArray,
    assertNumber,
    assertString,
    assertTuplesArrayOfTypes,
    buildAssertProperty,
} from './validate';

export const validateSM = (parsedSSC: Parse): ValidatedSSC | never => {
    const assertHeader = buildAssertProperty(parsedSSC.header);

    const selectableValue = assertHeader('SELECTABLE', assertString);
    let selectable: ValidatedSSC['header']['selectable'];
    if ((['YES', 'NO', 'EASY'] as const).includes(selectableValue as any)) {
        selectable = selectableValue as any;
    } else {
        selectable = 'YES';
    }

    const castHeaderString = (
        propertyKey: Parameters<typeof assertHeader>[0],
        { required = false } = {}
    ) =>
        assertHeader(propertyKey, assertString, {
            required: required,
            onTypeError: (val, originalError) => {
                if (typeof val === 'number') {
                    return val.toString();
                }

                throw originalError;
            },
        });

    const validatedHeader: ValidatedHeader = {
        version: assertHeader('VERSION', assertNumber),
        title: castHeaderString('TITLE', { required: true }),
        subtitle: castHeaderString('SUBTITLE'),
        artist: castHeaderString('ARTIST'),
        titleTranslit: castHeaderString('TITLETRANSLIT'),
        subtitleTranslit: castHeaderString('SUBTITLETRANSLIT'),
        artistTranslit: castHeaderString('ARTISTTRANSLIT'),
        genre: castHeaderString('GENRE'),
        origin: castHeaderString('ORIGIN'),
        credit: castHeaderString('CREDIT'),
        banner: assertHeader('BANNER', assertString),
        background: assertHeader('BACKGROUND', assertString),
        previewVideo: assertHeader('PREVIEWVID', assertString),
        cdTitle: castHeaderString('CDTITLE'),
        music: assertHeader('MUSIC', assertString, { required: true }),
        offset: assertHeader('OFFSET', assertNumber, { required: true }),
        sampleStart: assertHeader('SAMPLESTART', assertNumber),
        sampleLength: assertHeader('SAMPLELENGTH', assertNumber),
        selectable,
        // Not strictly enforce for now
        songType: assertHeader('SONGTYPE', assertString) as SongTypes,
        songCategory: assertHeader('SONGCATEGORY', assertString),
        volume: assertHeader('VOLUME', assertNumber),
        BPMs: assertHeader(
            'BPMS',
            assertTuplesArrayOfTypes([1, 2] as [number, number]),
            { required: true }
        ),
        timeSignatures: assertHeader(
            'TIMESIGNATURES',
            assertTuplesArrayOfTypes([1, 2, 3] as [number, number, number])
        ),
        tickCounts: assertHeader(
            'TICKCOUNTS',
            assertTuplesArrayOfTypes([1, 2] as [number, number]),
            { required: false, defaultValue: { default: [[0, 4]] } }
        ),
        combos: assertHeader(
            'COMBOS',
            assertTuplesArrayOfTypes([1, 2] as [number, number]),
            { required: false, defaultValue: { default: [[0, 1]] } }
        ),
        speeds: assertHeader(
            'SPEEDS',
            assertTuplesArrayOfTypes([1, 2, 3, 4] as [
                number,
                number,
                number,
                number
            ]),
            { required: false, defaultValue: { default: [[0, 1, 0, 0]] } }
        ),
        scrolls: assertHeader(
            'SCROLLS',
            assertTuplesArrayOfTypes([1, 2] as [number, number]),
            { required: false, defaultValue: { default: [[0.0, 1.0]] } }
        ),

        delays: assertHeader(
            'DELAYS',
            assertTuplesArrayOfTypes([1, 2] as [number, number]),
            { required: false, defaultValue: { default: [] } }
        ),
        stops: assertHeader(
            'STOPS',
            assertTuplesArrayOfTypes([1, 2] as [number, number]),
            { required: false, defaultValue: { default: [] } }
        ),
        warps: assertHeader(
            'WARPS',
            assertTuplesArrayOfTypes([1, 2] as [number, number]),
            { required: false, defaultValue: { default: [] } }
        ),
        labels: parsedSSC.header.LABELS,
        lastSecondHint: parsedSSC.header.LASTSECONDHINT,
        backgroundChanges: parsedSSC.header.BGCHANGES,
    };

    const validatedLevels = parsedSSC.levels.map<ValidatedLevel>((level) => {
        const assertLevel = buildAssertProperty(level);
        const castLevelString = (
            propertyKey: Exclude<
                Parameters<typeof assertLevel>[0],
                'NOTES' | 'SPECIALNOTES'
            >,
            { required = false } = {}
        ) => {
            return assertLevel(propertyKey, assertString, {
                required: false,
                onTypeError: (val, originalError) => {
                    if (typeof val === 'number') {
                        return val.toString();
                    }

                    throw originalError;
                },
            });
        };

        const validated: ValidatedLevel = {
            stepsType: assertLevel('STEPSTYPE', assertString, {
                required: true,
            }) as StepsType,
            description: castLevelString('DESCRIPTION'),
            difficulty: castLevelString('DIFFICULTY'),
            meter: assertLevel('METER', assertNumber, { required: true }),
            radarValues: assertLevel(
                'RADARVALUES',
                assertNDimensionalArray<number[][]>(2)
            ),
            credit: castLevelString('CREDIT'),
            offset: assertLevel('OFFSET', assertNumber, {
                defaultValue: {
                    defaultUndefined: validatedHeader.offset,
                },
            }),
            // bpm not required here
            BPMs: assertLevel(
                'BPMS',
                assertTuplesArrayOfTypes([1, 2] as [number, number]),
                {
                    defaultValue: { default: validatedHeader.BPMs },
                }
            ),
            stops: assertLevel(
                'STOPS',
                assertTuplesArrayOfTypes([1, 2] as [number, number]),
                {
                    defaultValue: {
                        defaultUndefined: validatedHeader.stops,
                        defaultNull: [],
                    },
                }
            ),
            delays: assertLevel(
                'DELAYS',
                assertTuplesArrayOfTypes([1, 2] as [number, number]),
                {
                    defaultValue: {
                        defaultUndefined: validatedHeader.delays,
                        defaultNull: [],
                    },
                }
            ),
            warps: assertLevel(
                'WARPS',
                assertTuplesArrayOfTypes([1, 2] as [number, number]),
                {
                    defaultValue: {
                        defaultUndefined: validatedHeader.warps,
                        defaultNull: [],
                    },
                }
            ),
            //-
            timeSignatures: assertLevel(
                'TIMESIGNATURES',
                assertTuplesArrayOfTypes([1, 2, 3] as [number, number, number]),
                {
                    defaultValue: {
                        default: validatedHeader.timeSignatures,
                    },
                }
            ),
            tickCounts: assertLevel(
                'TICKCOUNTS',
                assertTuplesArrayOfTypes([1, 2] as [number, number]),
                {
                    defaultValue: {
                        default: validatedHeader.tickCounts,
                    },
                }
            ),
            combos: assertLevel(
                'COMBOS',
                assertTuplesArrayOfTypes([1, 2] as [number, number]),
                {
                    defaultValue: {
                        default: validatedHeader.combos,
                    },
                }
            ),
            speeds: assertLevel(
                'SPEEDS',
                assertTuplesArrayOfTypes([1, 2, 3, 4] as [
                    number,
                    number,
                    number,
                    number
                ]),
                {
                    defaultValue: {
                        default: validatedHeader.speeds,
                    },
                }
            ),
            scrolls: assertLevel(
                'SCROLLS',
                assertTuplesArrayOfTypes([1, 2] as [number, number]),
                {
                    defaultValue: {
                        default: validatedHeader.scrolls,
                    },
                }
            ),
            fakes: assertLevel(
                'FAKES',
                assertTuplesArrayOfTypes([1, 2] as [number, number])
            ),
            labels: level.LABELS as ParsedAttribute,
            notes: assertLevel(
                'NOTES',
                assertNDimensionalArray<
                    SingleNotes | DoubleNotes | HalfDoubleNotes
                >(3)
            ),
            specialNotes: assertLevel('SPECIALNOTES', (t) => t instanceof Set),
        };

        return validated;
    });

    const validated: ValidatedSSC = {
        header: validatedHeader,
        levels: validatedLevels,
    };

    return validated;
};
