"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Periodico = void 0;
var Periodico = /** @class */ (function () {
    function Periodico(name) {
        this._name = name;
        this._title = [];
        this._company = [];
        this._date = [];
        this._link = [];
    }
    Object.defineProperty(Periodico.prototype, "name", {
        get: function () { return this._name; },
        set: function (v) { this._name = v; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Periodico.prototype, "title", {
        get: function () { return this._title; },
        set: function (v) { this._title = v; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Periodico.prototype, "company", {
        get: function () { return this._company; },
        set: function (v) { this._company = v; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Periodico.prototype, "date", {
        get: function () { return this._date; },
        set: function (v) { this._date = v; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Periodico.prototype, "link", {
        get: function () { return this._link; },
        set: function (v) { this._link = v; },
        enumerable: false,
        configurable: true
    });
    return Periodico;
}());
exports.Periodico = Periodico;
