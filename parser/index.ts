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

import { parse as _parseSSC, SyntaxError as _SyntaxError } from "./SSCParser";
import { ParsedSSC } from "./types";

export function parseSSC(
  input: string,
  options?: Record<string, unknown>
): ParsedSSC {
  return _parseSSC(input) as ParsedSSC;
}

export const SyntaxError = _SyntaxError as unknown as Error;

export { validateSSC } from "./validate";
