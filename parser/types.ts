export type ParsedAttribute = number | string | (number | string)[][];

export interface Meta {
  VERSION: ParsedAttribute;
  TITLE: ParsedAttribute;
  SUBTITLE: ParsedAttribute;
  ARTIST: ParsedAttribute;
  TITLETRANSLIT: ParsedAttribute;
  SUBTITLETRANSLIT: ParsedAttribute;
  ARTISTTRANSLIT: ParsedAttribute;
  GENRE: ParsedAttribute;
  ORIGIN: ParsedAttribute;
  CREDIT: ParsedAttribute;
  BANNER: ParsedAttribute;
  BACKGROUND: ParsedAttribute;
  PREVIEWVID: ParsedAttribute;
  CDTITLE: ParsedAttribute;
  MUSIC: ParsedAttribute;
  OFFSET: ParsedAttribute;
  SAMPLESTART: ParsedAttribute;
  SAMPLELENGTH: ParsedAttribute;
  SELECTABLE: ParsedAttribute;
  SONGTYPE: ParsedAttribute;
  SONGCATEGORY: ParsedAttribute;
  VOLUME: ParsedAttribute;
  BPMS: ParsedAttribute;
  TIMESIGNATURES: ParsedAttribute;
  TICKCOUNTS: ParsedAttribute;
  COMBOS: ParsedAttribute;
  SPEEDS: ParsedAttribute;
  DELAYS?: ParsedAttribute;
  STOPS: ParsedAttribute;
  WARPS: ParsedAttribute;
  SCROLLS: ParsedAttribute;
  LABELS: ParsedAttribute;
  LASTSECONDHINT: ParsedAttribute;
  BGCHANGES: ParsedAttribute;
}

type NotesWithoutMeaning =
  | "5"
  | "6"
  | "7"
  | "X"
  | "x"
  | "Y"
  | "y"
  | "Z"
  | "z"
  | "V"
  | "H"
  | "*"
  | "B"
  | "S"
  | "E"
  | "I"
  | "a";

// See https://github.com/stepmania/stepmania/wiki/Note-Types for more info
export enum KnownNotes {
  Nothing = "0",
  /**
   * Standard note type
   */
  Tap = "1",
  /**
   * Tap the hold note (as charged note on beat, frezze arrows on dance, etc.) when it crosses the judgment row, then hold it down. Note: Releasing the key during hold note in some themes breaks your combo.
   */
  HoldHead = "2",
  /**
   * You can let go of the hold when the end crosses the judgment row.
   */
  HoldEnd = "3",
  /**
   * Tap the roll note when it crosses the judgment row, then hit repeatly it until the end.
   */
  RollHead = "4",
  /**
   * Do not tap the negative notes (as mines, shock arrows, etc.) when it crosses or have your foot held down when it crosses. You will lose life and in some themes breaks your combo!
   */
  Mine = "M",
  /**
   * Have your foot on the arrow before it crosses. Lift up when it does cross.
   */
  Lift = "L",
  /**
   * You can ignore this note: it does nothing for or against you.
   */
  Fake = "F",
  /**
   * This 'note' is not really a note, it marks a keysound that will play automatically at this row. No note will appear here, and this is only used for empty rows.
   */
  AutoKeysound = "K",
}

export type PossibleNotes = `${KnownNotes}` | NotesWithoutMeaning;
export enum StepF2NoteTypes {
  /**
   * Used instead of '1' when it's a CO-OP chart.
   */
  P1TapNote = "X",
  /**
   * Used instead of '2' when it's a CO-OP chart.
   */
  P1HoldHead = "x",
  /**
   * Used instead of '1' when it's a CO-OP chart.
   */
  P2TapNote = "Y",
  /**
   * Used instead of '2' when it's a CO-OP chart.
   */
  P2HoldHead = "y",
  P3TapNote = "Z",
  P3HoldHead = "z",
  /**
   * Turns into P4 ONLY when P1, P2, and P3 is present, otherwise it's a regular note.
   */
  P1OrP4TapNote = "1",
  /**
   * Turns into P4 ONLY when P1, P2, and P3 is present, otherwise it's a regular note.
   */
  P1OrP4HoldHead = "2",
  /**
   * This note does nothing. Uses heart icon ONLY when P1,P2, and P3 is present otherwise it's a fake note.
   */
  Heart = "F",
  /**
   * Acts like the sudden modifier, but per note. Will suddenly appear halfway up.
   */
  Sudden = "S",
  /**
   * Acts like the hidden modifier, but per note. Will disappear halfway up.
   */
  Vanish = "V",
  /**
   * This note cannot be seen.
   */
  Hidden = "H",
}

export enum StepF2NoteAttributes {
  /**
   * This note does not have an attribute.
   */
  Normal = "n",
  /**
   * Will disappear halfway up.
   */
  Vanish = "v",
  /**
   * Will suddenly appear halfway up
   */
  Sudden = "s",
  /**
   * This note cannot be seen.
   */
  Hidden = "h",
}

export enum StepF2FakeFlag {
  Fake = "1",
  Normal = "0",
}

export type StepF2SpecialNote = {
  type: StepF2NoteTypes;
  attribute: StepF2NoteAttributes;
  /**
   *  if 1, this note is a fake note. If 0, this note is judged normally.
   */
  fakeFlag: StepF2FakeFlag;
  /** Not really used */
  reservedFlag: string;
};

export type Note = PossibleNotes | string[] | StepF2SpecialNote;

type Bars<Notes> = Array<Notes>;
type PadNotes<PadRepresentation> = Array<PadRepresentation>;

type Notes<PadRepresentation> = Bars<PadNotes<PadRepresentation>>;

export type SingleNotes = Notes<
  [DownLeft: Note, UpLeft: Note, Center: Note, UpRight: Note, DownRight: Note]
>;
export type DoubleNotes = Notes<
  [
    P1DownLeft: Note,
    P1UpLeft: Note,
    P1Center: Note,
    P1UpRight: Note,
    P1DownRight: Note,
    P1DownLeft: Note,
    P1UpLeft: Note,
    P1Center: Note,
    P1UpRight: Note,
    P1DownRight: Note
  ]
>;
export type HalfDoubleNotes = Notes<
  [
    P1Center: Note,
    P1UpRight: Note,
    P1DownRight: Note,
    P1DownLeft: Note,
    P1UpLeft: Note,
    P1Center: Note
  ]
>;

export interface Level {
  STEPSTYPE: ParsedAttribute;
  DESCRIPTION: ParsedAttribute;
  DIFFICULTY: ParsedAttribute;
  METER?: ParsedAttribute;
  RADARVALUES: ParsedAttribute;
  CREDIT: ParsedAttribute;
  OFFSET: ParsedAttribute;
  BPMS: ParsedAttribute;
  STOPS: ParsedAttribute;
  DELAYS?: ParsedAttribute;
  WARPS: ParsedAttribute;
  TIMESIGNATURES: ParsedAttribute;
  TICKCOUNTS: ParsedAttribute;
  COMBOS: ParsedAttribute;
  SPEEDS: ParsedAttribute;
  SCROLLS: ParsedAttribute;
  FAKES: ParsedAttribute;
  LABELS: ParsedAttribute;
  NOTES: SingleNotes | DoubleNotes | HalfDoubleNotes;
  SPECIALNOTES: Set<string>;
}

export interface ParsedSSC {
  header: Meta;
  levels: Level[];
}
