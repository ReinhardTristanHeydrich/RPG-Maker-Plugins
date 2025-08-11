"use strict";

require("core-js/modules/es.object.define-property.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseString = parseString;
exports.parseValue = parseValue;
require("core-js/modules/es.array.slice.js");
require("core-js/modules/es.number.is-safe-integer.js");
require("core-js/modules/es.parse-int.js");
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.string.from-code-point.js");
require("core-js/modules/es.string.replace.js");
var _util = require("./util.js");
var _date = require("./date.js");
var _error = require("./error.js");
/*!
 * Copyright (c) Squirrel Chat et al., All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var INT_REGEX = /^((0x[0-9a-fA-F](_?[0-9a-fA-F])*)|(([+-]|0[ob])?\d(_?\d)*))$/;
var FLOAT_REGEX = /^[+-]?\d(_?\d)*(\.\d(_?\d)*)?([eE][+-]?\d(_?\d)*)?$/;
var LEADING_ZERO = /^[+-]?0[0-9_]/;
var ESCAPE_REGEX = /^[0-9a-f]{4,8}$/i;
var ESC_MAP = {
  b: '\b',
  t: '\t',
  n: '\n',
  f: '\f',
  r: '\r',
  '"': '"',
  '\\': '\\'
};
function parseString(str) {
  var ptr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var endPtr = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : str.length;
  var isLiteral = str[ptr] === "'";
  var isMultiline = str[ptr++] === str[ptr] && str[ptr] === str[ptr + 1];
  if (isMultiline) {
    endPtr -= 2;
    if (str[ptr += 2] === '\r') ptr++;
    if (str[ptr] === '\n') ptr++;
  }
  var tmp = 0;
  var isEscape;
  var parsed = '';
  var sliceStart = ptr;
  while (ptr < endPtr - 1) {
    var c = str[ptr++];
    if (c === '\n' || c === '\r' && str[ptr] === '\n') {
      if (!isMultiline) {
        throw new _error.TomlError('newlines are not allowed in strings', {
          toml: str,
          ptr: ptr - 1
        });
      }
    } else if (c < '\x20' && c !== '\t' || c === '\x7f') {
      throw new _error.TomlError('control characters are not allowed in strings', {
        toml: str,
        ptr: ptr - 1
      });
    }
    if (isEscape) {
      isEscape = false;
      if (c === 'u' || c === 'U') {
        // Unicode escape
        var code = str.slice(ptr, ptr += c === 'u' ? 4 : 8);
        if (!ESCAPE_REGEX.test(code)) {
          throw new _error.TomlError('invalid unicode escape', {
            toml: str,
            ptr: tmp
          });
        }
        try {
          parsed += String.fromCodePoint(parseInt(code, 16));
        } catch (_unused) {
          throw new _error.TomlError('invalid unicode escape', {
            toml: str,
            ptr: tmp
          });
        }
      } else if (isMultiline && (c === '\n' || c === ' ' || c === '\t' || c === '\r')) {
        // Multiline escape
        ptr = (0, _util.skipVoid)(str, ptr - 1, true);
        if (str[ptr] !== '\n' && str[ptr] !== '\r') {
          throw new _error.TomlError('invalid escape: only line-ending whitespace may be escaped', {
            toml: str,
            ptr: tmp
          });
        }
        ptr = (0, _util.skipVoid)(str, ptr);
      } else if (c in ESC_MAP) {
        // Classic escape
        parsed += ESC_MAP[c];
      } else {
        throw new _error.TomlError('unrecognized escape sequence', {
          toml: str,
          ptr: tmp
        });
      }
      sliceStart = ptr;
    } else if (!isLiteral && c === '\\') {
      tmp = ptr - 1;
      isEscape = true;
      parsed += str.slice(sliceStart, tmp);
    }
  }
  return parsed + str.slice(sliceStart, endPtr - 1);
}
function parseValue(value, toml, ptr) {
  // Constant values
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === '-inf') return -Infinity;
  if (value === 'inf' || value === '+inf') return Infinity;
  if (value === 'nan' || value === '+nan' || value === '-nan') return NaN;
  if (value === '-0') return 0; // Avoid FP representation of -0
  // Numbers
  var isInt;
  if ((isInt = INT_REGEX.test(value)) || FLOAT_REGEX.test(value)) {
    if (LEADING_ZERO.test(value)) {
      throw new _error.TomlError('leading zeroes are not allowed', {
        toml: toml,
        ptr: ptr
      });
    }
    var numeric = +value.replace(/_/g, '');
    if (isNaN(numeric)) {
      throw new _error.TomlError('invalid number', {
        toml: toml,
        ptr: ptr
      });
    }
    if (isInt && !Number.isSafeInteger(numeric)) {
      throw new _error.TomlError('integer value cannot be represented losslessly', {
        toml: toml,
        ptr: ptr
      });
    }
    return numeric;
  }
  var date = new _date.TomlDate(value);
  if (!date.isValid()) {
    throw new _error.TomlError('invalid value', {
      toml: toml,
      ptr: ptr
    });
  }
  return date;
}