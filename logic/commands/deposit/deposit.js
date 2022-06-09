const config = require("../../../config.js");
const bot = require(config.DIRNAME + "/main.js");
const { User, BotDB, Lang, S, I, Op, commandRegexp } = require(config.LOGIC + "/helpers/DB.js");
const _ = " ";

const deposit = async (user_id, chat_id) => {

    const user = await User.findOne({
        where: {
            user_id: user_id
        }
    });
    

    if (!user) return bot.sendMessage(chat_id, S(BotDB.get().default_lang , "not_account"));
    const lang = user.lang;
    const currency = BotDB.get().currency;
    
    const str = "";
    bot.sendMessage(chat_id , str);
}

bot.onText(commandRegexp("deposit") , async(data) => {
    const user_id = data.from.id;
    const chat_id = data.chat.id;
    
    deposit(user_id, chat_id);
});

module.exports = deposit;
