import { Bot } from "./classes/bot";
import { Client } from "./classes/client";

class Sistema {
    constructor() {
        
    }
}

let bot = new Bot("https://localhost:44347/api/");
//bot.loadRss();
bot.init();