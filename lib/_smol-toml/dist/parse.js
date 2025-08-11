"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse = parse;
require("core-js/modules/es.object.define-property.js");
var _struct = require("./struct.js");
var _extract = require("./extract.js");
var _util = require("./util.js");
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

function peekTable(key, table, meta, type) {
  var t = table;
  var m = meta;
  var k;
  var hasOwn = false;
  var state;
  for (var i = 0; i < key.length; i++) {
    var _m$k, _m$k2;
    if (i) {
      t = hasOwn ? t[k] : t[k] = {};
      m = (state = m[k]).c;
      if (type === 0 /* Type.DOTTED */ && (state.t === 1 /* Type.EXPLICIT */ || state.t === 2 /* Type.ARRAY */)) {
        return null;
      }
      if (state.t === 2 /* Type.ARRAY */) {
        var l = t.length - 1;
        t = t[l];
        m = m[l].c;
      }
    }
    k = key[i];
    if ((hasOwn = Object.prototype.hasOwnProperty.call(t, k)) && ((_m$k = m[k]) === null || _m$k === void 0 ? void 0 : _m$k.t) === 0 /* Type.DOTTED */ && (_m$k2 = m[k]) !== null && _m$k2 !== void 0 && _m$k2.d) {
      return null;
    }
    if (!hasOwn) {
      if (k === '__proto__') {
        Object.defineProperty(t, k, {
          enumerable: true,
          configurable: true,
          writable: true
        });
        Object.defineProperty(m, k, {
          enumerable: true,
          configurable: true,
          writable: true
        });
      }
      m[k] = {
        t: i < key.length - 1 && type === 2 /* Type.ARRAY */ ? 3 /* Type.ARRAY_DOTTED */ : type,
        d: false,
        i: 0,
        c: {}
      };
    }
  }
  state = m[k];
  if (state.t !== type && !(type === 1 /* Type.EXPLICIT */ && state.t === 3 /* Type.ARRAY_DOTTED */)) {
    // Bad key type!
    return null;
  }
  if (type === 2 /* Type.ARRAY */) {
    if (!state.d) {
      state.d = true;
      t[k] = [];
    }
    t[k].push(t = {});
    state.c[state.i++] = state = {
      t: 1 /* Type.EXPLICIT */,
      d: false,
      i: 0,
      c: {}
    };
  }
  if (state.d) {
    // Redefining a table!
    return null;
  }
  state.d = true;
  if (type === 1 /* Type.EXPLICIT */) {
    t = hasOwn ? t[k] : t[k] = {};
  } else if (type === 0 /* Type.DOTTED */ && hasOwn) {
    return null;
  }
  return [k, t, state.c];
}
function parse(toml, opts) {
  var _opts$maxDepth;
  var maxDepth = (_opts$maxDepth = opts === null || opts === void 0 ? void 0 : opts.maxDepth) !== null && _opts$maxDepth !== void 0 ? _opts$maxDepth : 1000;
  var res = {};
  var meta = {};
  var tbl = res;
  var m = meta;
  for (var ptr = (0, _util.skipVoid)(toml, 0); ptr < toml.length;) {
    if (toml[ptr] === '[') {
      var isTableArray = toml[++ptr] === '[';
      var k = (0, _struct.parseKey)(toml, ptr += +isTableArray, ']');
      if (isTableArray) {
        if (toml[k[1] - 1] !== ']') {
          throw new _error.TomlError('expected end of table declaration', {
            toml: toml,
            ptr: k[1] - 1
          });
        }
        k[1]++;
      }
      var p = peekTable(k[0], res, meta, isTableArray ? 2 /* Type.ARRAY */ : 1 /* Type.EXPLICIT */);
      if (!p) {
        throw new _error.TomlError('trying to redefine an already defined table or value', {
          toml: toml,
          ptr: ptr
        });
      }
      m = p[2];
      tbl = p[1];
      ptr = k[1];
    } else {
      var _k = (0, _struct.parseKey)(toml, ptr);
      var _p = peekTable(_k[0], tbl, m, 0 /* Type.DOTTED */);
      if (!_p) {
        throw new _error.TomlError('trying to redefine an already defined table or value', {
          toml: toml,
          ptr: ptr
        });
      }
      var v = (0, _extract.extractValue)(toml, _k[1], void 0, maxDepth);
      _p[1][_p[0]] = v[0];
      ptr = v[1];
    }
    ptr = (0, _util.skipVoid)(toml, ptr, true);
    if (toml[ptr] && toml[ptr] !== '\n' && toml[ptr] !== '\r') {
      throw new _error.TomlError('each key-value declaration must be followed by an end-of-line', {
        toml: toml,
        ptr: ptr
      });
    }
    ptr = (0, _util.skipVoid)(toml, ptr);
  }
  return res;
}