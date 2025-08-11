"use strict";

require("core-js/modules/es.symbol.js");
require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.symbol.iterator.js");
require("core-js/modules/es.array.from.js");
require("core-js/modules/es.array.is-array.js");
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/es.date.to-string.js");
require("core-js/modules/es.function.name.js");
require("core-js/modules/es.object.define-property.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.regexp.to-string.js");
require("core-js/modules/es.string.iterator.js");
require("core-js/modules/web.dom-collections.iterator.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractValue = extractValue;
require("core-js/modules/es.array.index-of.js");
require("core-js/modules/es.array.slice.js");
require("core-js/modules/es.string.trim-end.js");
var _primitive = require("./primitive.js");
var _struct = require("./struct.js");
var _util = require("./util.js");
var _error = require("./error.js");
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; } /*!
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
function sliceAndTrimEndOf(str, startPtr, endPtr, allowNewLines) {
  var value = str.slice(startPtr, endPtr);
  var commentIdx = value.indexOf('#');
  if (commentIdx > -1) {
    // The call to skipComment allows to "validate" the comment
    // (absence of control characters)
    (0, _util.skipComment)(str, commentIdx);
    value = value.slice(0, commentIdx);
  }
  var trimmed = value.trimEnd();
  if (!allowNewLines) {
    var newlineIdx = value.indexOf('\n', trimmed.length);
    if (newlineIdx > -1) {
      throw new _error.TomlError('newlines are not allowed in inline tables', {
        toml: str,
        ptr: startPtr + newlineIdx
      });
    }
  }
  return [trimmed, commentIdx];
}
function extractValue(str, ptr, end) {
  var depth = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : -1;
  if (depth === 0) {
    throw new _error.TomlError('document contains excessively nested structures. aborting.', {
      toml: str,
      ptr: ptr
    });
  }
  var c = str[ptr];
  if (c === '[' || c === '{') {
    var _ref = c === '[' ? (0, _struct.parseArray)(str, ptr, depth) : (0, _struct.parseInlineTable)(str, ptr, depth),
      _ref2 = _slicedToArray(_ref, 2),
      value = _ref2[0],
      _endPtr = _ref2[1];
    var newPtr = (0, _util.skipUntil)(str, _endPtr, ',', end);
    if (end === '}') {
      var nextNewLine = (0, _util.indexOfNewline)(str, _endPtr, newPtr);
      if (nextNewLine > -1) {
        throw new _error.TomlError('newlines are not allowed in inline tables', {
          toml: str,
          ptr: nextNewLine
        });
      }
    }
    return [value, newPtr];
  }
  var endPtr;
  if (c === '"' || c === "'") {
    endPtr = (0, _util.getStringEnd)(str, ptr);
    var parsed = (0, _primitive.parseString)(str, ptr, endPtr);
    if (end) {
      endPtr = (0, _util.skipVoid)(str, endPtr, end !== ']');
      if (str[endPtr] && str[endPtr] !== ',' && str[endPtr] !== end && str[endPtr] !== '\n' && str[endPtr] !== '\r') {
        throw new _error.TomlError('unexpected character encountered', {
          toml: str,
          ptr: endPtr
        });
      }
      endPtr += +(str[endPtr] === ',');
    }
    return [parsed, endPtr];
  }
  endPtr = (0, _util.skipUntil)(str, ptr, ',', end);
  var slice = sliceAndTrimEndOf(str, ptr, endPtr - +(str[endPtr - 1] === ','), end === ']');
  if (!slice[0]) {
    throw new _error.TomlError('incomplete key-value declaration: no value specified', {
      toml: str,
      ptr: ptr
    });
  }
  if (end && slice[1] > -1) {
    endPtr = (0, _util.skipVoid)(str, ptr + slice[1]);
    endPtr += +(str[endPtr] === ',');
  }
  return [(0, _primitive.parseValue)(slice[0], str, ptr), endPtr];
}