import { parse as _parseSM } from './SMParser';
import { parse as _parseSSC, SyntaxError as _SyntaxError } from './SSCParser';
import { Parse } from './types';

export function parseSSC(
    input: string,
    options?: Record<string, unknown>
): Parse {
    return _parseSSC(input, options) as Parse;
}

export function parseSM(
    input: string,
    options?: Record<string, unknown>
): Parse {
    return _parseSM(input, options) as Parse;
}

export const SyntaxError = _SyntaxError as unknown as Error;

export { validateSSC } from './validate';
export { validateSM } from './validateSM';
