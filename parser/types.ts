export interface Meta {
    VERSION: number;
    TITLE: string;
    SUBTITLE: string;
    ARTIST: string;
    TITLETRANSLIT: number;
    SUBTITLETRANSLIT: string;
    ARTISTTRANSLIT: string;
    GENRE: string;
    ORIGIN: string;
    CREDIT: string;
    BANNER: string;
    BACKGROUND: string;
    PREVIEWVID: string;
    CDTITLE: string;
    MUSIC: string;
    OFFSET: number;
    SAMPLESTART: number;
    SAMPLELENGTH: number;
    SELECTABLE: string;
    SONGTYPE: string;
    SONGCATEGORY: string;
    VOLUME: number;
    BPMS: number[][];
    TIMESIGNATURES: number[][];
    TICKCOUNTS: number[][];
    COMBOS: number[][];
    SPEEDS: number[][];
    DELAYS?: '' | number[];
    STOPS: string; // TODO
    WARPS: number[][]; // TODO
    SCROLLS: number[][];
    LABELS: [number, string][];
    LASTSECONDHINT: number;
    BGCHANGES: any[][];
}

export interface Level {
    STEPSTYPE: string;
    DESCRIPTION: string;
    DIFFICULTY: string;
    METER?: number;
    RADARVALUES: number[][];
    CREDIT: string;
    OFFSET: number;
    BPMS: number[][];
    STOPS: string; // TODO
    DELAYS?: '' | number[];
    WARPS: number[][]; // TODO
    TIMESIGNATURES: number[][];
    TICKCOUNTS: number[][];
    COMBOS: number[][];
    SPEEDS: number[][];
    SCROLLS: number[][];
    FAKES: string;
    LABELS: [number, string][];
    NOTES: string[][][];
    SPECIALNOTES: Record<string, unknown>;
}

export interface ParsedSSC {
    header: Meta;
    levels: Level[];
};