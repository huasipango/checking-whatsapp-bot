"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
var Client = /** @class */ (function () {
    function Client(phone) {
        this._phone = phone;
        this._choose = [];
    }
    Object.defineProperty(Client.prototype, "phone", {
        get: function () { return this._phone; },
        set: function (v) { this._phone = v; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Client.prototype, "choose", {
        get: function () { return this._choose; },
        set: function (v) { this._choose = v; },
        enumerable: false,
        configurable: true
    });
    return Client;
}());
exports.Client = Client;
