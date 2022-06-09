const config = require("../../../config.js");
const bot = require(config.DIRNAME + "/main.js");
const { User, BotDB, Lang, S, I, Op, commandRegexp } = require(config.LOGIC + "/helpers/DB.js");
const _ = " ";

const wallet = async (user_id, chat_id) => {

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
                { text: I("waller") + _ + S(lang, "set_wallet"), callback_data: "set_wallet" }
            ]
        }
    };

    const str = I("wallet") + _ + S(lang, "wallet") + ": \n\n" +
        S(lang, "add_wallet_desc")
        .replace(/_CURRENCY_/g, currency)
        .replace(/_WALLET_/g, (user.wallet == "" ? "Ninguna" : user.wallet));
    bot.sendMessage(chat_id, str, opts);
}

bot.onText(commandRegexp("wallet"), async (data) => {
    const user_id = data.from.id;
    const chat_id = data.chat.id;
    console.log("aqui");
    wallet(user_id, chat_id);
});

var set_wallet = {};

bot.on("callback_query", async (data) => {
    const user_id = data.from.id;
    const chat_id = data.message.chat.id;
    const mess_id = data.message.message_id;
    bot.deleteMessage(chat_id, mess_id);

    if (data.data != "set_wallet") return;


    const user = await User.findOne({
        where: {
            user_id: user_id
        }
    });


    if (!user) return bot.sendMessage(chat_id, S(BotDB.get().default_lang, "not_account"));
    const lang = user.lang;


    set_wallet[user_id] = true;
    bot.sendMessage(chat_id, I("edit") + _ + S(lang, "insert_wallet"));
});

bot.on("message" , (data) => {
    const user_id = data.from.id;
    const chat_id = data.chat.id;
    
    if(!set_wallet[user_id]) return;
    
    delete set_wallet[user_id];
    
    const user = await User.findOne({
        where: {
            user_id: user_id
        }
    });
    
    
    if (!user) return bot.sendMessage(chat_id, S(BotDB.get().default_lang, "not_account"));
    const lang = user.lang;
    
    const char = /^[a-zA-Z0-9]+$/;
    if(!char.test(data.text)) return bot.sendMessage(chat_id , S(lang , "wrong_wallet"));
    
    const updt = await user.setData({
        wallet : data.text
    });
    
    if(updt) bot.sendMessage(chat_id , I("save") + _ + S(lang , "wallet_saved"));
    wallet(user_id , chat_id);
});

module.exports = wallet;
