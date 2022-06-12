const config = require("../../../config.js");
const bot = require(config.DIRNAME + "/main.js");
const { User, BotDB, Lang, S, I, Op, commandRegexp } = require(config.LOGIC + "/helpers/DB.js");
const _ = " ";
require("./lang.js");

const settings = async (user_id, chat_id) => {

    const user = await User.findOne({
        where: {
            user_id: user_id
        }
    });


    if (!user) return bot.sendMessage(chat_id, S(BotDB.get().default_lang, "not_account"));
    const lang = user.lang;
    const Bot = BotDB.get();


    const opts = {
        parse_mode: "Markdown",
        reply_markup: {
            resize_keyboard: true,
            keyboard: [
                [I("lang") + _ + S(lang , "language")],
                [I("menu") + _ + S(lang , "menu")]
            ]
        }
    };
    
    if(Bot.admins.includes(user_id)) opts.reply_markup.keyboard[opts.reply_markup.keyboard.length - 1].push(S(lang , "admin") + _ + I("admin"));

    const str = I("settings") + _ + S(lang, "settings");
    bot.sendMessage(chat_id, str, opts);
};

bot.onText(commandRegexp("settings", true), async (data) => {
    const user_id = data.from.id;
    const chat_id = data.chat.id;

    settings(user_id, chat_id);
});

module.exports = settings;
