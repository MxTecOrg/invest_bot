const config = require("../../../config.js");
const bot = require(config.DIRNAME + "/main.js");
const { User, BotDB, I, S, commandRegexp } = require(config.LOGIC + "/helpers/DB.js");
require("./broadcast.js");
const _ = " ";

bot.onText(commandRegexp("admin", true), async (data) => {
    const user_id = data.from.id;
    const chat_id = data.chat.id;
    const Bot = BotDB.get();
    if (!Bot.admins.includes(user_id)) return;

    const user = await User.findOne({
        where: {
            user_id: user_id
        }
    });
    const lang = user.lang;

    const opts = {
        parse_mode: "Markdown",
        reply_markup: {
            resize_keyboard: true,
            keyboard: [
                    [I("general_settings") + _ + S(lang, "general_settings") , S(lang , "icons") + _ + I("icons")],
                    [I("text") + _ + S(lang, "text") , S(lang , "broadcast") + _ + I("broadcast")],
                    [I("menu") + _ + S(lang , "menu")]
                ]
        }
    };
    
    bot.sendMessage(chat_id ,I("admin") + _ + S(lang ,"admin") , opts);

});
