const config = require("../../../config.js");
const bot = require(config.DIRNAME + "/main.js");
const { User, BotDB, Lang, S, I, Op, commandRegexp } = require(config.LOGIC + "/helpers/DB.js");
const _ = " ";

const support = async (user_id, chat_id) => {

    const user = await User.findOne({
        where: {
            user_id: user_id
        }
    });


    if (!user) return bot.sendMessage(chat_id, S(BotDB.get().default_lang, "not_account"));
    const lang = user.lang;
    const Bot = BotDB.get();
    const contact = (Bot.contact ? I("user") + _ + S(lang , "contact") + ": " + Bot.contact + "\n" : "");
    const group = (Bot.group ? I("group") + _ + S(lang , "group") + ": " + Bot.group + "\n" : "");
    const email = (Bot.email ? I("email") + _ + S(lang , "email") + ": " + Bot.email + "\n" : "");

    const opts = {
        parse_mode: "html"
    };

    const str = I("support") + _ + S(lang , "support") + ": \n\n" +
        S(lang, "support_desc")
        .replace(/_CONTACT_/g, contact)
        .replace(/_GROUP_/g , group)
        .replace(/_EMAIL_/g, email);
    bot.sendMessage(chat_id, str, opts);
};

bot.onText(commandRegexp("support") , async(data) => {
    const user_id = data.from.id;
    const chat_id = data.chat.id;
    
    support(user_id, chat_id);
});

module.exports = support;
