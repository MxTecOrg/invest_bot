const config = require("./config.js");
const {BotDB , Lang} = require(config.LOGIC + "/helper/DB.js");
const TelegramBot = require('node-telegram-bot-api'); 
const bot = new TelegramBot(config.TOKEN, {polling: true}); 
BotDB.load();
Lang.load();
module.exports = bot;
require(config.LOGIC + "/router.js");
