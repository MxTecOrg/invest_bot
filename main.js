const config = require("./config.js");
const {BotDB , Lang , Icons} = require(config.LOGIC + "/helpers/DB.js");
const TelegramBot = require('node-telegram-bot-api'); 
const bot = new TelegramBot(config.TOKEN, {polling: true}); 
BotDB.load();
Lang.load();
Icons.load();
module.exports = bot;
require(config.LOGIC + "/router.js");
