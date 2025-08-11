"use strict";

require("core-js/modules/es.symbol.js");
require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.symbol.iterator.js");
require("core-js/modules/es.array.from.js");
require("core-js/modules/es.array.is-array.js");
require("core-js/modules/es.date.to-string.js");
require("core-js/modules/es.function.name.js");
require("core-js/modules/es.regexp.to-string.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseArray = parseArray;
exports.parseInlineTable = parseInlineTable;
exports.parseKey = parseKey;
require("core-js/modules/es.array.index-of.js");
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/es.array.slice.js");
require("core-js/modules/es.object.define-property.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.set.js");
require("core-js/modules/es.string.iterator.js");
require("core-js/modules/es.string.trim-end.js");
require("core-js/modules/es.string.trim-start.js");
require("core-js/modules/web.dom-collections.iterator.js");
var _primitive = require("./primitive.js");
var _extract = require("./extract.js");
var _util = require("./util.js");
var _error = require("./error.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
var KEY_PART_RE = /^[a-zA-Z0-9-_]+[ \t]*$/;
function parseKey(str, ptr) {
  var end = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '=';
  var dot = ptr - 1;
  var parsed = [];
  var endPtr = str.indexOf(end, ptr);
  if (endPtr < 0) {
    throw new _error.TomlError('incomplete key-value: cannot find end of key', {
      toml: str,
      ptr: ptr
    });
  }
  do {
    var c = str[ptr = ++dot];
    // If it's whitespace, ignore
    if (c !== ' ' && c !== '\t') {
      // If it's a string
      if (c === '"' || c === "'") {
        if (c === str[ptr + 1] && c === str[ptr + 2]) {
          throw new _error.TomlError('multiline strings are not allowed in keys', {
            toml: str,
            ptr: ptr
          });
        }
        var eos = (0, _util.getStringEnd)(str, ptr);
        if (eos < 0) {
          throw new _error.TomlError('unfinished string encountered', {
            toml: str,
            ptr: ptr
          });
        }
        dot = str.indexOf('.', eos);
        var strEnd = str.slice(eos, dot < 0 || dot > endPtr ? endPtr : dot);
        var newLine = (0, _util.indexOfNewline)(strEnd);
        if (newLine > -1) {
          throw new _error.TomlError('newlines are not allowed in keys', {
            toml: str,
            ptr: ptr + dot + newLine
          });
        }
        if (strEnd.trimStart()) {
          throw new _error.TomlError('found extra tokens after the string part', {
            toml: str,
            ptr: eos
          });
        }
        if (endPtr < eos) {
          endPtr = str.indexOf(end, eos);
          if (endPtr < 0) {
            throw new _error.TomlError('incomplete key-value: cannot find end of key', {
              toml: str,
              ptr: ptr
            });
          }
        }
        parsed.push((0, _primitive.parseString)(str, ptr, eos));
      } else {
        // Normal raw key part consumption and validation
        dot = str.indexOf('.', ptr);
        var part = str.slice(ptr, dot < 0 || dot > endPtr ? endPtr : dot);
        if (!KEY_PART_RE.test(part)) {
          throw new _error.TomlError('only letter, numbers, dashes and underscores are allowed in keys', {
            toml: str,
            ptr: ptr
          });
        }
        parsed.push(part.trimEnd());
      }
    }
    // Until there's no more dot
  } while (dot + 1 && dot < endPtr);
  return [parsed, (0, _util.skipVoid)(str, endPtr + 1, true, true)];
}
function parseInlineTable(str, ptr) {
  var depth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1;
  var res = {};
  var seen = new Set();
  var c;
  var comma = 0;
  ptr++;
  while ((c = str[ptr++]) !== '}' && c) {
    if (c === '\n') {
      throw new _error.TomlError('newlines are not allowed in inline tables', {
        toml: str,
        ptr: ptr - 1
      });
    } else if (c === '#') {
      throw new _error.TomlError('inline tables cannot contain comments', {
        toml: str,
        ptr: ptr - 1
      });
    } else if (c === ',') {
      throw new _error.TomlError('expected key-value, found comma', {
        toml: str,
        ptr: ptr - 1
      });
    } else if (c !== ' ' && c !== '\t') {
      var k = void 0;
      var t = res;
      var hasOwn = false;
      var _parseKey = parseKey(str, ptr - 1),
        _parseKey2 = _slicedToArray(_parseKey, 2),
        key = _parseKey2[0],
        keyEndPtr = _parseKey2[1];
      for (var i = 0; i < key.length; i++) {
        if (i) t = hasOwn ? t[k] : t[k] = {};
        k = key[i];
        if ((hasOwn = Object.prototype.hasOwnProperty.call(t, k)) && (_typeof(t[k]) !== 'object' || seen.has(t[k]))) {
          throw new _error.TomlError('trying to redefine an already defined value', {
            toml: str,
            ptr: ptr
          });
        }
        if (!hasOwn && k === '__proto__') {
          Object.defineProperty(t, k, {
            enumerable: true,
            configurable: true,
            writable: true
          });
        }
      }
      if (hasOwn) {
        throw new _error.TomlError('trying to redefine an already defined value', {
          toml: str,
          ptr: ptr
        });
      }
      var _extractValue = (0, _extract.extractValue)(str, keyEndPtr, '}', depth - 1),
        _extractValue2 = _slicedToArray(_extractValue, 2),
        value = _extractValue2[0],
        valueEndPtr = _extractValue2[1];
      seen.add(value);
      t[k] = value;
      ptr = valueEndPtr;
      comma = str[ptr - 1] === ',' ? ptr - 1 : 0;
    }
  }
  if (comma) {
    throw new _error.TomlError('trailing commas are not allowed in inline tables', {
      toml: str,
      ptr: comma
    });
  }
  if (!c) {
    throw new _error.TomlError('unfinished table encountered', {
      toml: str,
      ptr: ptr
    });
  }
  return [res, ptr];
}
function parseArray(str, ptr) {
  var depth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1;
  var res = [];
  var c;
  ptr++;
  while ((c = str[ptr++]) !== ']' && c) {
    if (c === ',') {
      throw new _error.TomlError('expected value, found comma', {
        toml: str,
        ptr: ptr - 1
      });
    } else if (c === '#') ptr = (0, _util.skipComment)(str, ptr);else if (c !== ' ' && c !== '\t' && c !== '\n' && c !== '\r') {
      var e = (0, _extract.extractValue)(str, ptr - 1, ']', depth - 1);
      res.push(e[0]);
      ptr = e[1];
    }
  }
  if (!c) {
    throw new _error.TomlError('unfinished array encountered', {
      toml: str,
      ptr: ptr
    });
  }
  return [res, ptr];
}