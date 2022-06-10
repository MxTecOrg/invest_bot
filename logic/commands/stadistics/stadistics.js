const config = require("../../../config.js");
const bot = require(config.DIRNAME + "/main.js");
const { User, BotDB, Lang, S, I, Op, commandRegexp } = require(config.LOGIC + "/helpers/DB.js");
const _ = " ";

const stadistics = async (user_id, chat_id) => {

    const user = await User.findOne({
        where: {
            user_id: user_id
        }
    });


    if (!user) return bot.sendMessage(chat_id, S(BotDB.get().default_lang, "not_account"));
    const lang = user.lang;
    const Bot = BotDB.get();
    const currency = Bot.currency;
    const total_users = Bot.total_users;
    const total_invest = Bot.total_invested;
    const total_withdraw = Bot.total_withdraw;

    const opts = {
        parse_mode: "MarkdownV2"
    };

    const str = I("stadistics") + _ + S(lang , "stadistics") + ": \n\n" +
        S(lang, "stadistics_desc")
        .replace(/_CURRENCY_/g, currency)
        .replace(/_TOTAL_USERS_/g, total_users)
        .replace(/_TOTAL_INVEST_/g, total_invest)
        .replace(/_TOTAL_WITHDRAW_/g, total_withdraw);
    bot.sendMessage(chat_id, str, opts);
};

bot.onText(commandRegexp("stadistics" , true) , async(data) => {
    const user_id = data.from.id;
    const chat_id = data.chat.id;
    
    stadistics(user_id, chat_id);
});

module.exports = stadistics;
