/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    DoubleNotes,
    HalfDoubleNotes,
    Parse,
    ParsedAttribute,
    SingleNotes,
} from './types';

export enum SongTypes {
    Shortcut = 'SHORTCUT',
    Arcade = 'ARCADE',
    Remix = 'REMIX',
    FullSong = 'FULLSONG',
    MusicTrain = 'MUSICTRAIN',
}

export enum StepsType {
    Single = 'pump-single',
    Double = 'pump-double',
    Half = 'pump-halfdouble',
    Routine = 'pump-routine',
}

export type ValidatedLevel = {
    stepsType: StepsType;
    description: string;
    difficulty: string;
    meter: number;
    radarValues: number[][];
    /**
     * Step Artist
     */
    credit: string;
    /**
     * The song start offset. Overrides the song offset when set
     */
    offset: number;
    /**
     * A list of BPMs this song uses. The first value is when the BPM changes, and the second value is what to change it to.
     */
    BPMs: [Timestamp: number, BPMFromThisTimestamp: number][];
    stops?: number[][];
    delays?: ParsedAttribute;
    warps: ParsedAttribute;
    /**
     * A list of time signatures, the first value being when the signature changes, the second and third being the signature (For example, 4=4 is 4/4 time). Note that this is not implemented in StepMania, the value does nothing at all and will not change the measure lines displayed in-game. However, ArrowVortex uses it so it may help you create charts.
     */
    timeSignatures: [
        Timestamp: number,
        FirstSignature: number,
        SecondSignature: number
    ][];
    /**
     * List of 'ticks' to apply during a hold note, which seems to be based on the BPM.
     */
    tickCounts: [number, number][];
    combos: [number, number][];
    /**
     * When to apply, scroll speed multiplier, tween time, second or beat timing (either 0 or 1).
     */
    speeds: [number, number, number, number][];
    scrolls: [number, number][];
    fakes: number[][];
    /**
     * We do not have enough knowledge😶
     */
    labels: ParsedAttribute;
    notes: SingleNotes | DoubleNotes | HalfDoubleNotes;
    specialNotes: Set<string>;
};

export type ValidatedSSC = {
    version: number;
    title: string;
    subtitle: string;
    artist: string | string[];
    /**
     * The transliterated name of the song, meaning the name in pure English characters. For example, if the song's name is 冥, the tag would say "Mei", as that is the romanized name.
     */
    titleTranslit: string;
    /**
     * See `titleTranslit`
     */
    subtitleTranslit: string;
    /**
     * See titleTranslit
     */
    artistTranslit: string;

    /**
     * The genre of the song. Used for genre sorts in StepMania, but has special meanings in StepF2.
     * In StepF2, you can use FULLSONG, J-MUSIC, K-POP, etc change where the song is sorted in the group (PIU sorts songs by genre within groups).
     */
    genre: string;

    /**
     * This tag is never used for anything, it is essentially a free tag to put anything you want. The original intent was to specify what game the song came from, but virtually no themes use it.
     * In SM-AMW this is used for what year the song came from, allowing you to sort by year.
     */
    origin: string;

    /**
     * The stepmaker credit, but since charts can have their own credits this tag is redundant and essentially depreciated.
     */
    credit: string;

    /**
     * The relative path to the banner
     */
    banner: string;

    /**
     * The relative path to the background.
     */
    background: string;

    /**
     * The relative path to the preview video. Preview videos are used in pump themes and displayed while hovering over a song.
     */
    previewVideo: string;

    /**
     * The relative path to the "CD Title", which is a spinning graphic that some themes display on top of the banner/jacket while hovering over the song. Most themes no longer use this.
     */
    cdTitle: string;

    /**
     * The relative path to the song's music file.
     */
    music: string;

    /**
     * The song start offset. Overridden if the chart has its own offset.
     */
    offset: number;

    /**
     * The time in seconds to start playing the song's sample while previewing it in the music select.
     */
    sampleStart: number;

    /**
     * The length in seconds to play the sample.
     */
    sampleLength: number;

    /**
     * If this song is available in the music select while the unlock system is enabled. If the unlock system is disabled, this song is always selectable.
     * In StepMania, the only valid values are "YES" and "NO", and any other value will default to "YES".
     * In StepAMW, you may use "YES", "NO", and "EASY". "EASY" means this song is only available if GAMESTATE:SetBasicMode() was called before entering the music select and the unlock system is enabled.
     */
    selectable: 'YES' | 'NO' | 'EASY';

    /**
     * The type of the song. See the enum for possible values.
     */
    songType: SongTypes;

    /**
     * Folder of the song
     */
    songCategory: string;

    /**
     * Volume of the song. From 0 to an arbitrary number.
     */
    volume: number;

    /**
     * A list of BPMs this song uses. However, individual charts can have their own BPMs. The first value is when the BPM changes, and the second value is what to change it to.
     */
    BPMs: [Timestamp: number, BPMFromThisTimestamp: number][];

    /**
     * A list of time signatures, the first value being when the signature changes, the second and third being the signature (For example, 4=4 is 4/4 time). Note that this is not implemented in StepMania, the value does nothing at all and will not change the measure lines displayed in-game. However, ArrowVortex uses it so it may help you create charts.
     */
    timeSignatures: [
        Timestamp: number,
        FirstSignature: number,
        SecondSignature: number
    ][];

    /**
     * Number of ticks (perfects if combos is 1) a beat is worth when holding a hold step.
     */
    tickCounts: [number, number][];

    /**
     * Number of perfects a tick is worth on holds
     */
    combos: [number, number][];
    /**
     * When to apply, scroll speed multiplier, tween time, second or beat timing (either 0 or 1).
     */
    speeds: [number, number, number, number][];

    /**
     * Scrolling speed at beat. Does not affect BPM nor the spacing of the notes in the canvas (unlike speeds)
     */
    scrolls: [number, number][];

    /**
     * Add a delay (in seconds) at beat. This gimmick stops the sequencer. Delays come after the beat (PIU-style)
     */
    delays?: [number, number][];

    /**
     * Add a stop (in seconds) at beat. This gimmick stops the sequencer. Stops come before the beat (DDR-style)
     */
    stops: [number, number][];

    /**
     * Add a skip fragment at beat worth no-beats. Notes inside the warp are treated as fakes.
     */
    warps: [number, number][];

    /**
     * We don't know 😥
     */
    labels: ParsedAttribute;
    lastSecondHint: ParsedAttribute;
    backgroundChanges: ParsedAttribute;

    /**
     * Each one of the NOTEDATA sections
     */
    levels: ValidatedLevel[];
};

export const validateSSC = (parsedSSC: Parse): ValidatedSSC | never => {
    const assertHeader = buildAssertProperty(parsedSSC.header);

    const selectableValue = assertHeader('SELECTABLE', assertString);
    let selectable: ValidatedSSC['selectable'];
    if ((['YES', 'NO', 'EASY'] as const).includes(selectableValue as any)) {
        selectable = selectableValue as any;
    } else {
        selectable = 'YES';
    }

    const castHeaderString = (
        propertyKey: Parameters<typeof assertHeader>[0]
    ) =>
        assertHeader(propertyKey, assertString, {
            required: false,
            onTypeError: (val, originalError) => {
                if (typeof val === 'number') {
                    return val.toString();
                }

                throw originalError;
            },
        });

    const validated: ValidatedSSC = {
        version: assertHeader('VERSION', assertNumber),
        title: castHeaderString('TITLE'),
        subtitle: castHeaderString('SUBTITLE'),
        artist: assertHeader(
            'ARTIST',
            assertUnion(assertString, assertNDimensionalArray<string[]>(1))
        ),
        titleTranslit: castHeaderString('TITLETRANSLIT'),
        subtitleTranslit: castHeaderString('SUBTITLETRANSLIT'),
        artistTranslit: castHeaderString('ARTISTTRANSLIT'),
        genre: castHeaderString('GENRE'),
        origin: castHeaderString('ORIGIN'),
        credit: assertHeader(
            'CREDIT',
            assertUnion(assertString, assertNDimensionalArray<string[]>(1))
        ),
        banner: assertHeader('BANNER', assertString),
        background: assertHeader('BACKGROUND', assertString),
        previewVideo: assertHeader('PREVIEWVID', assertString),
        cdTitle: castHeaderString('CDTITLE'),
        music: assertHeader('MUSIC', assertString),
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
            { required: false, defaultValue: [[0, 4]] }
        ),
        combos: assertHeader(
            'COMBOS',
            assertTuplesArrayOfTypes([1, 2] as [number, number])
        ),
        speeds: assertHeader(
            'SPEEDS',
            assertTuplesArrayOfTypes([1, 2, 3, 4] as [
                number,
                number,
                number,
                number
            ]),
            { required: false, defaultValue: [[0, 4]] }
        ),
        scrolls: assertHeader(
            'SCROLLS',
            assertTuplesArrayOfTypes([1, 2] as [number, number]),
            { required: false, defaultValue: [[0.0, 1.0]] }
        ),

        delays: assertHeader(
            'DELAYS',
            assertTuplesArrayOfTypes([1, 2] as [number, number]),
            { required: false, defaultValue: [] }
        ),
        stops: assertHeader(
            'STOPS',
            assertTuplesArrayOfTypes([1, 2] as [number, number]),
            { required: false, defaultValue: [] }
        ),
        warps: assertHeader(
            'WARPS',
            assertTuplesArrayOfTypes([1, 2] as [number, number]),
            { required: false, defaultValue: [] }
        ),
        labels: parsedSSC.header.LABELS,
        lastSecondHint: parsedSSC.header.LASTSECONDHINT,
        backgroundChanges: parsedSSC.header.BGCHANGES,
        levels: parsedSSC.levels.map<ValidatedLevel>((level) => {
            const assertLevel = buildAssertProperty(level);
            const castLevelString = (
                propertyKey: Exclude<
                    Parameters<typeof assertLevel>[0],
                    'NOTES' | 'SPECIALNOTES'
                >
            ) =>
                assertLevel(propertyKey, assertString, {
                    required: false,
                    onTypeError: (val, originalError) => {
                        if (typeof val === 'number') {
                            return val.toString();
                        }

                        throw originalError;
                    },
                });

            const validated: ValidatedLevel = {
                stepsType: assertLevel('STEPSTYPE', assertString, {
                    required: true,
                }) as StepsType,
                description: castLevelString('DESCRIPTION'),
                difficulty: castLevelString('DIFFICULTY'),
                meter: assertLevel('METER', assertNumber),
                radarValues: assertLevel(
                    'RADARVALUES',
                    assertNDimensionalArray<number[][]>(2)
                ),
                credit: assertLevel(
                    'CREDIT',
                    assertUnion(
                        assertString,
                        assertNDimensionalArray<string[]>(1)
                    )
                ),
                offset: assertLevel('OFFSET', assertNumber),
                // bpm not required here
                BPMs: assertLevel(
                    'BPMS',
                    assertTuplesArrayOfTypes([1, 2] as [number, number])
                ),
                stops: assertLevel(
                    'STOPS',
                    assertTuplesArrayOfTypes([1, 2] as [number, number])
                ),
                delays: assertLevel(
                    'DELAYS',
                    assertTuplesArrayOfTypes([1, 2] as [number, number])
                ),
                warps: assertLevel(
                    'WARPS',
                    assertTuplesArrayOfTypes([1, 2] as [number, number])
                ),
                timeSignatures: assertLevel(
                    'TIMESIGNATURES',
                    assertTuplesArrayOfTypes([1, 2, 3] as [
                        number,
                        number,
                        number
                    ])
                ),
                tickCounts: assertLevel(
                    'TICKCOUNTS',
                    assertTuplesArrayOfTypes([1, 2] as [number, number])
                ),
                combos: assertLevel(
                    'COMBOS',
                    assertTuplesArrayOfTypes([1, 2] as [number, number])
                ),
                speeds: assertLevel(
                    'SPEEDS',
                    assertTuplesArrayOfTypes([1, 2, 3, 4] as [
                        number,
                        number,
                        number,
                        number
                    ])
                ),
                scrolls: assertLevel(
                    'SCROLLS',
                    assertTuplesArrayOfTypes([1, 2] as [number, number])
                ),
                fakes: assertLevel(
                    'FAKES',
                    assertNDimensionalArray<number[][]>(2)
                ),
                labels: level.LABELS as ParsedAttribute,
                notes: assertLevel(
                    'NOTES',
                    assertNDimensionalArray<
                        SingleNotes | DoubleNotes | HalfDoubleNotes
                    >(3)
                ),
                specialNotes: assertLevel(
                    'SPECIALNOTES',
                    (t) => t instanceof Set
                ),
            };

            return validated;
        }),
    };

    return validated;
};

function assertString(t?: ParsedAttribute): t is string | never {
    if (t === undefined) return false;

    if (typeof t !== 'string') {
        throw new Error(
            `Expected string but got "${JSON.stringify(
                t
            )}" of type ${typeof t} instead`
        );
    }

    return true;
}

function assertNumber(t?: ParsedAttribute): t is number | never {
    if (t === undefined) return false;
    if (typeof t !== 'number')
        throw new Error(
            `Expected number but got "${JSON.stringify(
                t
            )}" of type ${typeof t} instead`
        );

    return true;
}

type GuardedType<T> = T extends (x: any) => x is infer U ? U : never;

type AssertOptions<T> = {
    required?: boolean;
    defaultValue?: T;
    onTypeError?: (val: unknown, originalError: Error) => T | never;
};
const buildAssertProperty =
    <T>(value: T) =>
    <
        Key extends string & keyof T,
        AssertFunction extends (value: T[Key]) => any
    >(
        key: Key,
        assertFunction: AssertFunction,
        { required, defaultValue, onTypeError }: AssertOptions<T[Key]> = {}
    ): GuardedType<AssertFunction> => {
        try {
            const isUndefined = !assertFunction(value[key]);
            if (required && isUndefined) {
                throw new Error(`Property ${key} is required.`);

                // add possibility to set a default value when a property is not required
            } else if (!required && isUndefined && defaultValue !== undefined) {
                value[key] = defaultValue;
            }
            return value[key] as GuardedType<AssertFunction>;
        } catch (e) {
            if (onTypeError) {
                return onTypeError(
                    value[key],
                    e as Error
                ) as GuardedType<AssertFunction>;
            }
            throw new Error(
                `Error validating property "${key}". ${(e as Error).message}`
            );
        }
    };

const assertUnion =
    <Key extends keyof ParsedAttribute>(
        ...assertFunctions: ((value?: ParsedAttribute) => boolean)[]
    ) =>
    (t?: ParsedAttribute) => {
        for (const fn of assertFunctions) {
            try {
                const result = fn(t);
                if (!result) continue;

                return result;
            } catch (e) {
                if (fn === assertFunctions[assertFunctions.length - 1]) throw e;
            }
        }
    };

const assertTuplesArrayOfTypes =
    <T extends Array<string | number>>(references: T) =>
    (t?: ParsedAttribute): t is T[] | never => {
        if (t === undefined) return false;
        if (typeof t !== 'object')
            throw new Error(
                `Expected double-dimensional array but got ${typeof t}`
            );

        const misMatchIndex = references.findIndex((referenceType, index) =>
            t.some((tuple) => typeof referenceType !== typeof tuple[index])
        );
        if (misMatchIndex !== -1) {
            throw new Error(
                `Expected all elements to be of types [${references
                    .map((c) => typeof c)
                    .join(', ')}], but got [${t[misMatchIndex]
                    .map((c) => typeof c)
                    .join(', ')}] (Values = ${JSON.stringify(
                    t[misMatchIndex]
                )})`
            );
        }

        return true;
    };

const assertNDimensionalArray =
    <T extends Array<unknown>>(n = 1) =>
    (t?: ParsedAttribute | unknown): t is T => {
        if (t === undefined) return false;
        if (n < 1) throw new Error(`n should be greater or equal than 1`);

        if (!Array.isArray(t)) return false;

        const isArrayOfDepth = (
            array: unknown[],
            expectedDepth = n
        ): boolean => {
            if (expectedDepth === 1) return Array.isArray(array);

            return array.every((item) =>
                isArrayOfDepth(item as unknown[], expectedDepth - 1)
            );
        };

        return isArrayOfDepth(t);
    };
