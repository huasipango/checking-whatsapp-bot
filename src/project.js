"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bot_1 = require("./classes/bot");
var Sistema = /** @class */ (function () {
    function Sistema() {
    }
    return Sistema;
}());
var bot = new bot_1.Bot("https://localhost:44347/api/");
bot.loadRss();
bot.init();
