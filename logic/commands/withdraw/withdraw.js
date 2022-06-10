const config = require("../../../config.js");
const bot = require(config.DIRNAME + "/main.js");
const { User, BotDB, Lang, S, I, Op, commandRegexp } = require(config.LOGIC + "/helpers/DB.js");
const _ = " ";
const Wallet = require(config.LOGIC + "/commands/wallet/wallet.js");

const withdraw = async (user_id, chat_id) => {

    const user = await User.findOne({
        where: {
            user_id: user_id
        }
    });
    

    if (!user) return bot.sendMessage(chat_id, S(BotDB.get().default_lang , "not_account"));
    const lang = user.lang;
    const Bot = BotDB.get();
    const wallet = user.wallet;
    const balance = user.balance;
    const currency = Bot.currency;
    const min_invest = Bot.min_invest;
    
    if(user.wallet == "") return Wallet(user_id , chat_id);
    
    
    const opts = {
        reply_markup: {
            inline_keyboard: [
                [{ text: I("withdraw") + _ + S(lang, "withdraw"), callback_data: "withdraw" }]
            ]
        },
        parse_mode : "MarkdownV2"
    };
    
    const str = I("withdraw") + _ + S(lang , "withdraw") + ": \n\n" +
    S(lang , "withdraw_desc")
    .replace(/_WALLET_/g , wallet)
    .replace(/_CURRENCY_/g , currency)
    .replace(/_BALANCE_/g , balance)
    .replace(/_MIN_WITHDRAW_/g , min_withdraw);
    bot.sendMessage(chat_id , str , opts);
};

var wtdrw = {};

bot.on("callback_query", async (data) => {
    const user_id = data.from.id;
    const chat_id = data.message.chat.id;
    const mess_id = data.message.message_id;
    bot.deleteMessage(chat_id, mess_id);

    if (data.data != "withdraw") return;


    const user = await User.findOne({
        where: {
            user_id: user_id
        }
    });


    if (!user) return bot.sendMessage(chat_id, S(BotDB.get().default_lang, "not_account"));
    const lang = user.lang;
    
    if(user.balance < Bot.get().min_withdraw) return bot.sendMessage(chat_id , S(lang , "not_funds"));

    wtdrw[user_id] = true;
    bot.sendMessage(chat_id, I("edit") + _ + S(lang, "make_withdraw") , { parse_mode: "MarkdownV2" });
});

bot.on("message", async (data) => {
    const user_id = data.from.id;
    const chat_id = data.chat.id;

    if (!wtdrw[user_id]) return;

    delete wtdrw[user_id];

    const user = await User.findOne({
        where: {
            user_id: user_id
        }
    });


    if (!user) return bot.sendMessage(chat_id, S(BotDB.get().default_lang, "not_account"));
    const lang = user.lang;

    const char = /^[0-9]+$/;
    if (!isNan(data.text) || data.text < Bot.get().min_withdraw || data.text > user.balance) return bot.sendMessage(chat_id, S(lang, "wrong_sum"));

    const updt = await user.setData({
        balance: user.balance - data.text
    });

    if (updt) bot.sendMessage(chat_id, I("save") + _ + S(lang, "withdrawed"));
    withdraw(user_id, chat_id);
});

bot.onText(commandRegexp("withdraw" , true) , async(data) => {
    const user_id = data.from.id;
    const chat_id = data.chat.id;
    
    withdraw(user_id, chat_id);
});

module.exports = withdraw;
