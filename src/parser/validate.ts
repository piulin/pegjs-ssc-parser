import { Parse, ParsedAttribute } from './types';

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
    radarValues: any[];
    // CREDIT
    // OFFSET
    // BPMS
    // STOPS
    // DELAYS
    // WARPS
    // TIMESIGNATURES
    // TICKCOUNTS
    // COMBOS
    // SPEEDS
    // SCROLLS
    // FAKES
    // LABELS
    // NOTES
    // SPECIALNOTES
};

export type ValidatedSSC = {
    version: number;
    title: string;
    subtitle: string;
    artist: string;

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
     * List of 'ticks' to apply during a hold note, which seems to be based on the BPM.
     * TODO.
     */
    tickCounts: [number, number][];

    /**
     * No idea. TODO
     */
    combos: [number, number][];
    /**
     * When to apply, scroll speed multiplier, tween time, second or beat timing (either 0 or 1).
     */
    speeds: [number, number, number, number][];

    /**
     * No idea. TODO
     */
    scrolls: [number, number][];

    /**
     * TODO
     */
    delays?: ParsedAttribute;
    stops: ParsedAttribute;
    warps: ParsedAttribute;
    labels: ParsedAttribute;
    lastSecondHint: ParsedAttribute;
    backgroundChanges: ParsedAttribute;

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

    const validated: ValidatedSSC = {
        version: assertHeader('VERSION', assertNumber),
        title: assertHeader('TITLE', assertString),
        subtitle: assertHeader('SUBTITLE', assertString),
        artist: assertHeader('ARTIST', assertString),
        titleTranslit: assertHeader('TITLETRANSLIT', assertString),
        subtitleTranslit: assertHeader('SUBTITLETRANSLIT', assertString),
        artistTranslit: assertHeader('ARTISTTRANSLIT', assertString),
        genre: assertHeader('GENRE', assertString),
        origin: assertHeader('ORIGIN', assertString),
        credit: assertHeader('CREDIT', assertString),
        banner: assertHeader('BANNER', assertString),
        background: assertHeader('BACKGROUND', assertString),
        previewVideo: assertHeader('PREVIEWVID', assertString),
        cdTitle: assertHeader('CDTITLE', assertString),
        music: assertHeader('MUSIC', assertString),
        offset: assertHeader('OFFSET', assertNumber, true),
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
            true
        ),
        timeSignatures: assertHeader(
            'TIMESIGNATURES',
            assertTuplesArrayOfTypes([1, 2, 3] as [number, number, number])
        ),
        tickCounts: assertHeader(
            'TICKCOUNTS',
            assertTuplesArrayOfTypes([1, 2] as [number, number]),
            false,
            [0, 4]
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
            false,
            [[0, 1, 0, 0]]
        ),
        scrolls: assertHeader(
            'SCROLLS',
            assertTuplesArrayOfTypes([1, 2] as [number, number]),
            false,
            [[0.0, 1.0]]
        ),

        delays: assertHeader(
            'DELAYS',
            assertTuplesArrayOfTypes([1, 2] as [number, number]),
            false,
            []
        ),
        stops: assertHeader(
            'STOPS',
            assertTuplesArrayOfTypes([1, 2] as [number, number]),
            false,
            []
        ),
        warps: assertHeader(
            'WARPS',
            assertTuplesArrayOfTypes([1, 2] as [number, number]),
            false,
            []
        ),
        labels: parsedSSC.header.LABELS,
        lastSecondHint: parsedSSC.header.LASTSECONDHINT,
        backgroundChanges: parsedSSC.header.BGCHANGES,
        levels: parsedSSC.levels.map<ValidatedLevel>((level) => {
            const assertLevel = buildAssertProperty(level);
            const validated: ValidatedLevel = {
                stepsType: assertLevel('STEPSTYPE', assertString) as StepsType,
                description: assertLevel('DESCRIPTION', assertString),
                difficulty: assertLevel('DIFFICULTY', assertString),
                meter: assertLevel('METER', assertNumber),
                radarValues: assertLevel(
                    'RADARVALUES',
                    assertNDimensionalArray(2)
                ),
            };

            return validated;
        }),
    };

    return validated;
};

function assertString(t?: ParsedAttribute): t is string | never {
    if (t === undefined) return false;

    if (typeof t !== 'string')
        throw new Error(
            `Expected string but got "${JSON.stringify(
                t
            )}" of type ${typeof t} instead`
        );

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

const buildAssertProperty =
    <T>(value: T) =>
    <
        Key extends string & keyof T,
        AssertFunction extends (value: T[Key]) => any
    >(
        key: Key,
        assertFunction: AssertFunction,
        required = false,
        defaultValue: any = undefined
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
            throw new Error(
                `Error validating property "${key}. ${(e as Error).message}"`
            );
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
    (n = 1) =>
    <T extends Array<string | number>>(t?: ParsedAttribute): t is T[] => {
        if (t === undefined) return false;
        if (n < 1) throw new Error(`n should be greater or equal than 1`);

        if (!Array.isArray(t)) return false;

        const isArrayOfDepth = (array: any[], expectedDepth = n): boolean => {
            if (expectedDepth === 1) return Array.isArray(array);

            return array.every((item) =>
                isArrayOfDepth(item, expectedDepth - 1)
            );
        };

        return isArrayOfDepth(t);
    };
