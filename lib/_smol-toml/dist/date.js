"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
require("core-js/modules/es.symbol.js");
require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.symbol.iterator.js");
require("core-js/modules/es.symbol.to-primitive.js");
require("core-js/modules/es.array.index-of.js");
require("core-js/modules/es.date.to-primitive.js");
require("core-js/modules/es.function.bind.js");
require("core-js/modules/es.map.js");
require("core-js/modules/es.number.constructor.js");
require("core-js/modules/es.object.create.js");
require("core-js/modules/es.object.define-property.js");
require("core-js/modules/es.object.get-own-property-descriptor.js");
require("core-js/modules/es.object.get-prototype-of.js");
require("core-js/modules/es.object.set-prototype-of.js");
require("core-js/modules/es.reflect.construct.js");
require("core-js/modules/es.reflect.get.js");
require("core-js/modules/es.regexp.to-string.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TomlDate = void 0;
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/es.array.slice.js");
require("core-js/modules/es.date.to-iso-string.js");
require("core-js/modules/es.date.to-string.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.string.iterator.js");
require("core-js/modules/es.string.match.js");
require("core-js/modules/es.weak-map.js");
require("core-js/modules/web.dom-collections.iterator.js");
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _superPropGet(t, o, e, r) { var p = _get(_getPrototypeOf(1 & r ? t.prototype : t), o, e); return 2 & r && "function" == typeof p ? function (t) { return p.apply(e, t); } : p; }
function _get() { return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function (e, t, r) { var p = _superPropBase(e, t); if (p) { var n = Object.getOwnPropertyDescriptor(p, t); return n.get ? n.get.call(arguments.length < 3 ? e : r) : n.value; } }, _get.apply(null, arguments); }
function _superPropBase(t, o) { for (; !{}.hasOwnProperty.call(t, o) && null !== (t = _getPrototypeOf(t));); return t; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _classPrivateFieldInitSpec(e, t, a) { _checkPrivateRedeclaration(e, t), t.set(e, a); }
function _checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function _classPrivateFieldGet(s, a) { return s.get(_assertClassBrand(s, a)); }
function _classPrivateFieldSet(s, a, r) { return s.set(_assertClassBrand(s, a), r), r; }
function _assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }
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
var DATE_TIME_RE = /^(\d{4}-\d{2}-\d{2})?[T ]?(?:(\d{2}):\d{2}:\d{2}(?:\.\d+)?)?(Z|[-+]\d{2}:\d{2})?$/i;
var _hasDate = /*#__PURE__*/new WeakMap();
var _hasTime = /*#__PURE__*/new WeakMap();
var _offset = /*#__PURE__*/new WeakMap();
var TomlDate = exports.TomlDate = /*#__PURE__*/function (_Date) {
  function TomlDate(date) {
    var _this;
    _classCallCheck(this, TomlDate);
    var hasDate = true;
    var hasTime = true;
    var offset = 'Z';
    if (typeof date === 'string') {
      var match = date.match(DATE_TIME_RE);
      if (match) {
        if (!match[1]) {
          hasDate = false;
          date = "0000-01-01T".concat(date);
        }
        hasTime = !!match[2];
        // Do not allow rollover hours
        if (match[2] && +match[2] > 23) {
          date = '';
        } else {
          offset = match[3] || null;
          date = date.toUpperCase();
          if (!offset && hasTime) date += 'Z';
        }
      } else {
        date = '';
      }
    }
    _this = _callSuper(this, TomlDate, [date]);
    _classPrivateFieldInitSpec(_this, _hasDate, false);
    _classPrivateFieldInitSpec(_this, _hasTime, false);
    _classPrivateFieldInitSpec(_this, _offset, null);
    if (!isNaN(_this.getTime())) {
      _classPrivateFieldSet(_hasDate, _this, hasDate);
      _classPrivateFieldSet(_hasTime, _this, hasTime);
      _classPrivateFieldSet(_offset, _this, offset);
    }
    return _this;
  }
  _inherits(TomlDate, _Date);
  return _createClass(TomlDate, [{
    key: "isDateTime",
    value: function isDateTime() {
      return _classPrivateFieldGet(_hasDate, this) && _classPrivateFieldGet(_hasTime, this);
    }
  }, {
    key: "isLocal",
    value: function isLocal() {
      return !_classPrivateFieldGet(_hasDate, this) || !_classPrivateFieldGet(_hasTime, this) || !_classPrivateFieldGet(_offset, this);
    }
  }, {
    key: "isDate",
    value: function isDate() {
      return _classPrivateFieldGet(_hasDate, this) && !_classPrivateFieldGet(_hasTime, this);
    }
  }, {
    key: "isTime",
    value: function isTime() {
      return _classPrivateFieldGet(_hasTime, this) && !_classPrivateFieldGet(_hasDate, this);
    }
  }, {
    key: "isValid",
    value: function isValid() {
      return _classPrivateFieldGet(_hasDate, this) || _classPrivateFieldGet(_hasTime, this);
    }
  }, {
    key: "toISOString",
    value: function toISOString() {
      var iso = _superPropGet(TomlDate, "toISOString", this, 3)([]);
      // Local Date
      if (this.isDate()) return iso.slice(0, 10);
      // Local Time
      if (this.isTime()) return iso.slice(11, 23);
      // Local DateTime
      if (_classPrivateFieldGet(_offset, this) === null) return iso.slice(0, -1);
      // Offset DateTime
      if (_classPrivateFieldGet(_offset, this) === 'Z') return iso;
      // This part is quite annoying: JS strips the original timezone from the ISO string representation
      // Instead of using a "modified" date and "Z", we restore the representation "as authored"
      var offset = +_classPrivateFieldGet(_offset, this).slice(1, 3) * 60 + +_classPrivateFieldGet(_offset, this).slice(4, 6);
      offset = _classPrivateFieldGet(_offset, this)[0] === '-' ? offset : -offset;
      var offsetDate = new Date(this.getTime() - offset * 60e3);
      return offsetDate.toISOString().slice(0, -1) + _classPrivateFieldGet(_offset, this);
    }
  }], [{
    key: "wrapAsOffsetDateTime",
    value: function wrapAsOffsetDateTime(jsDate) {
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Z';
      var date = new TomlDate(jsDate);
      _classPrivateFieldSet(_offset, date, offset);
      return date;
    }
  }, {
    key: "wrapAsLocalDateTime",
    value: function wrapAsLocalDateTime(jsDate) {
      var date = new TomlDate(jsDate);
      _classPrivateFieldSet(_offset, date, null);
      return date;
    }
  }, {
    key: "wrapAsLocalDate",
    value: function wrapAsLocalDate(jsDate) {
      var date = new TomlDate(jsDate);
      _classPrivateFieldSet(_hasTime, date, false);
      _classPrivateFieldSet(_offset, date, null);
      return date;
    }
  }, {
    key: "wrapAsLocalTime",
    value: function wrapAsLocalTime(jsDate) {
      var date = new TomlDate(jsDate);
      _classPrivateFieldSet(_hasDate, date, false);
      _classPrivateFieldSet(_offset, date, null);
      return date;
    }
  }]);
}(/*#__PURE__*/_wrapNativeSuper(Date));