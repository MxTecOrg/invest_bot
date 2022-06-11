const config = require("../../../config.js");
const bot = require(config.DIRNAME + "/main.js");
const { User, BotDB, Lang, S, I, Op, commandRegexp } = require(config.LOGIC + "/helpers/DB.js");
const _ = " ";
const Wallet = require(config.LOGIC + "/commands/wallet/wallet.js");

const deposit = async (user_id, chat_id) => {

    const user = await User.findOne({
        where: {
            user_id: user_id
        }
    });
    

    if (!user) return bot.sendMessage(chat_id, S(BotDB.get().default_lang , "not_account"));
    const lang = user.lang;
    const Bot = BotDB.get();
    const wallet = Bot.wallet;
    const currency = Bot.currency;
    const min_invest = Bot.min_invest;
    const max_invest = Bot.min_invest;
    const invest_time = (Bot.invest_time < 0 ? S(lang , "undefined") : Bot.invest_time + _ + S(lang , "days"));
    const daily_earn = Bot.earn;
    const plan_earn = (Bot.invest_time < 0 ? (30 * daily_earn) + "%/" + S(lang , "month") : (Bot.invest_time * daily_earn) + "%/" + Bot.invest_time + "-" + S(lang , "days"))
    
    if(user.wallet == "") return Wallet(user_id , chat_id);
    
    const str = I("deposit") + _ + S(lang , "deposit") + ": \n\n" +
    S(lang , "deposit_desc")
    .replace(/_WALLET_/g , wallet)
    .replace(/_CURRENCY_/g , currency)
    .replace(/_MIN_DEPOSIT_/g , min_invest)
    .replace(/_MAX_DEPOSIT_/g , max_invest)
    .replace(/_INVEST_TIME_/g , invest_time)
    .replace(/_DAILY_EARN_/g , daily_earn)
    .replace(/_PLAN_EARN_/g , plan_earn);
    bot.sendMessage(chat_id , str , {parse_mode : "MarkdownV2"});
}

bot.onText(commandRegexp("deposit") , async(data) => {
    const user_id = data.from.id;
    const chat_id = data.chat.id;
    
    deposit(user_id, chat_id);
});

module.exports = deposit;
