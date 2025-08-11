"use strict";

require("core-js/modules/es.object.define-property.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stringify = stringify;
require("core-js/modules/es.symbol.js");
require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.symbol.iterator.js");
require("core-js/modules/es.array.concat.js");
require("core-js/modules/es.array.is-array.js");
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/es.date.to-iso-string.js");
require("core-js/modules/es.date.to-json.js");
require("core-js/modules/es.date.to-string.js");
require("core-js/modules/es.object.keys.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.regexp.to-string.js");
require("core-js/modules/es.string.iterator.js");
require("core-js/modules/es.string.replace.js");
require("core-js/modules/es.string.trim.js");
require("core-js/modules/web.dom-collections.iterator.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
var BARE_KEY = /^[a-z0-9-_]+$/i;
function extendedTypeOf(obj) {
  var type = _typeof(obj);
  if (type === 'object') {
    if (Array.isArray(obj)) return 'array';
    if (obj instanceof Date) return 'date';
  }
  return type;
}
function isArrayOfTables(obj) {
  for (var i = 0; i < obj.length; i++) {
    if (extendedTypeOf(obj[i]) !== 'object') return false;
  }
  return obj.length != 0;
}
function formatString(s) {
  return JSON.stringify(s).replace(/\x7f/g, "\\u007f");
}
function stringifyValue(val, type, depth) {
  if (depth === 0) {
    throw new Error("Could not stringify the object: maximum object depth exceeded");
  }
  if (type === 'number') {
    if (isNaN(val)) return 'nan';
    if (val === Infinity) return 'inf';
    if (val === -Infinity) return '-inf';
    return val.toString();
  }
  if (type === 'bigint' || type === 'boolean') {
    return val.toString();
  }
  if (type === 'string') {
    return formatString(val);
  }
  if (type === 'date') {
    if (isNaN(val.getTime())) {
      throw new TypeError('cannot serialize invalid date');
    }
    return val.toISOString();
  }
  if (type === 'object') {
    return stringifyInlineTable(val, depth);
  }
  if (type === 'array') {
    return stringifyArray(val, depth);
  }
}
function stringifyInlineTable(obj, depth) {
  var keys = Object.keys(obj);
  if (keys.length === 0) return '{}';
  var res = '{ ';
  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    if (i) res += ', ';
    res += BARE_KEY.test(k) ? k : formatString(k);
    res += ' = ';
    res += stringifyValue(obj[k], extendedTypeOf(obj[k]), depth - 1);
  }
  return res + ' }';
}
function stringifyArray(array, depth) {
  if (array.length === 0) return '[]';
  var res = '[ ';
  for (var i = 0; i < array.length; i++) {
    if (i) res += ', ';
    if (array[i] === null || array[i] === void 0) {
      throw new TypeError('arrays cannot contain null or undefined values');
    }
    res += stringifyValue(array[i], extendedTypeOf(array[i]), depth - 1);
  }
  return res + ' ]';
}
function stringifyArrayTable(array, key, depth) {
  if (depth === 0) {
    throw new Error("Could not stringify the object: maximum object depth exceeded");
  }
  var res = '';
  for (var i = 0; i < array.length; i++) {
    res += "[[".concat(key, "]]\n");
    res += stringifyTable(array[i], key, depth);
    res += '\n\n';
  }
  return res;
}
function stringifyTable(obj, prefix, depth) {
  if (depth === 0) {
    throw new Error("Could not stringify the object: maximum object depth exceeded");
  }
  var preamble = '';
  var tables = '';
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    if (obj[k] !== null && obj[k] !== void 0) {
      var type = extendedTypeOf(obj[k]);
      if (type === 'symbol' || type === 'function') {
        throw new TypeError("cannot serialize values of type '".concat(type, "'"));
      }
      var key = BARE_KEY.test(k) ? k : formatString(k);
      if (type === 'array' && isArrayOfTables(obj[k])) {
        tables += stringifyArrayTable(obj[k], prefix ? "".concat(prefix, ".").concat(key) : key, depth - 1);
      } else if (type === 'object') {
        var tblKey = prefix ? "".concat(prefix, ".").concat(key) : key;
        tables += "[".concat(tblKey, "]\n");
        tables += stringifyTable(obj[k], tblKey, depth - 1);
        tables += '\n\n';
      } else {
        preamble += key;
        preamble += ' = ';
        preamble += stringifyValue(obj[k], type, depth);
        preamble += '\n';
      }
    }
  }
  return "".concat(preamble, "\n").concat(tables).trim();
}
function stringify(obj, opts) {
  var _opts$maxDepth;
  if (extendedTypeOf(obj) !== 'object') {
    throw new TypeError('stringify can only be called with an object');
  }
  var maxDepth = (_opts$maxDepth = opts === null || opts === void 0 ? void 0 : opts.maxDepth) !== null && _opts$maxDepth !== void 0 ? _opts$maxDepth : 1000;
  return stringifyTable(obj, '', maxDepth);
}