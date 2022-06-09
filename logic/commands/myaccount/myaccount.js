const config = require("../../../config.js");
const bot = require(config.DIRNAME + "/main.js");
const { User, BotDB, Lang, S, I, Op, commandRegexp } = require(config.LOGIC + "/helpers/DB.js");
const _ = " ";

const myaccount = async (user_id, chat_id , username) => {

    const user = await User.findOne({
        where: {
            user_id: user_id
        }
    });
    

    if (!user) return bot.sendMessage(chat_id, "Esta cuenta no existe , use el comando /start para crear una.");
    const lang = user.lang;
    const currency = BotDB.get().currency;
    
    const ai = JSON.parse(user.investments);
    let active_investments = 0;
    for(let i of ai){
        active_investments += i.amount;
    }

    
    const str = I("account") + _ + S(lang , "account") + ":\n\n" +
    I("user") + _ + S(lang , "user") + ": " + username + "\n" +
    I("balance") + _ + S(lang , "balance") + ": " + user.balance + _ + currency + "\n" +
    I("wallet") + _ + S(lang , "active_investments") + ": " + active_investments + _ + currency + "\n" +
    I("referral") + _ + S(lang , "ref_earns") + ": " + user.ref_earn + _ + currency;
    
    bot.sendMessage(chat_id , str);
}

bot.onText(commandRegexp("account") , async(data) => {
    const user_id = data.from.id;
    const chat_id = data.chat.id;
    const username = data.from.first_name;
    myaccount(user_id, chat_id , username);
});

module.exports = myaccount;
