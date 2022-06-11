const config = require("../../../config.js");
const bot = require(config.DIRNAME + "/main.js");
const { User, BotDB, Lang, S, I, Op, commandRegexp } = require(config.LOGIC + "/helpers/DB.js");
const _ = " ";

const calc = async (user_id, chat_id) => {

    const user = await User.findOne({
        where: {
            user_id: user_id
        }
    });


    if (!user) return bot.sendMessage(chat_id, S(BotDB.get().default_lang, "not_account"));
    const lang = user.lang;
    const currency = BotDB.get().currency;

    const opts = {
        reply_markup: {
            inline_keyboard: [
                [{ text: I("calc") + _ + S(lang, "calculate"), callback_data: "calculate" }]
            ]
        },
        parse_mode : "MarkdownV2"
    };

    const str = I("calc") + _ + S(lang, "calc") + ": \n\n" +
        S(lang, "calculate_desc")
        .replace(/_CURRENCY_/g, currency);
    bot.sendMessage(chat_id, str, opts);
}

bot.onText(commandRegexp("calc" , true), async (data) => {
    const user_id = data.from.id;
    const chat_id = data.chat.id;
    
    calc(user_id, chat_id);
});

var _calculate = {};

bot.on("callback_query", async (data) => {
    const user_id = data.from.id;
    const chat_id = data.message.chat.id;
    const mess_id = data.message.message_id;

    if (data.data != "calculate") return;
    bot.deleteMessage(chat_id, mess_id);

    const user = await User.findOne({
        where: {
            user_id: user_id
        }
    });


    if (!user) return bot.sendMessage(chat_id, S(BotDB.get().default_lang, "not_account"));
    const lang = user.lang;


    _calculate[user_id] = true;
    bot.sendMessage(chat_id, I("edit") + _ + S(lang, "insert_calc").replace(/_CURRENCY_/g , BotDB.get().currency) , {parse_mode : "MarkdownV2"});
});

bot.on("message" , async (data) => {
    const user_id = data.from.id;
    const chat_id = data.chat.id;
    
    if(!_calculate[user_id]) return;
    
    delete _calculate[user_id];
    
    const user = await User.findOne({
        where: {
            user_id: user_id
        }
    });
    
    
    if (!user) return bot.sendMessage(chat_id, S(BotDB.get().default_lang, "not_account"));
    const lang = user.lang;
    
    const char = /^[0-9]+$/;
    if(isNaN(data.text)) return bot.sendMessage(chat_id , S(lang , "wrong_num"));
    const Bot = BotDB.get();
    const currency = Bot.currency;
    const invest = Number(data.text);
    const invest_time = (Bot.invest_time < 1 ? S(lang , "undefined") : BotDB.invest_time + S(lang , "days"));
    const daily_earn = Bot.earn * invest / 100;
    const total_earn = (Bot.invest_time < 1 ? (daily_earn * 30) + _ + S(lang , "month") + _ : daily_earn * Bot.invest_time);
    
    const str = I("calc") + _ + S(lang , "calc") + ": \n\n"+
    S(lang , "calc_desc")
    .replace(/_CURRENCY_/g , currency)
    .replace(/_INVEST_/g , invest)
    .replace(/_INVEST_TIME_/g , invest_time)
    .replace(/_DAILY_EARN_/g , daily_earn)
    .replace(/_TOTAL_EARN_/g , total_earn);
    
    bot.sendMessage(chat_id , str , {parse_mode : "MarkdownV2"});
    
    calc(user_id , chat_id);
});

module.exports = calc;
