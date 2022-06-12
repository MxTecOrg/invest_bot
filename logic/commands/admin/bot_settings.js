const config = require("../../../config.js");
const bot = require(config.DIRNAME + "/main.js");
const { User, BotDB, Lang, Icons, S, I, Op, commandRegexp } = require(config.LOGIC + "/helpers/DB.js");
const _ = " ";

const bot_settings = async (user_id, chat_id) => {

    const user = await User.findOne({
        where: {
            user_id: user_id
        }
    });


    if (!user) return bot.sendMessage(chat_id, S(BotDB.get().default_lang, "not_account"));
    const lang = user.lang;
    const Bot = BotDB.get();

    if (!Bot.admins.includes(user_id)) return;

    let opts = {
        reply_markup: {
            inline_keyboard: [

            ]
        },
        parse_mode: "Markdown"
    };

    for (let opt in Bot) {
        opts.reply_markup.inline_keyboard.push([{
            text: (S(lang, opt) != "???" ? S(lang, opt) + " - " + (Bot[opt].length > 10 ? Bot[opt].substring(0, 9) + "..." : Bot[opt]) : opt + " - " + (Bot[opt].length > 10 ? Bot[opt].substring(0, 9) : Bot[opt])),
            callback_data: "set_bot_setting " + opt
        }]);
    }

    const str = I("general_settings") + _ + S(lang, "general_settings") + ": \n\n" +
        S(lang, "general_settings_desc");
    bot.sendMessage(chat_id, str, opts);
};

var set_bot = {};

bot.on("callback_query", async (data) => {
    const user_id = data.from.id;
    const chat_id = data.message.chat.id;
    const mess_id = data.message.message_id;


    if (!data.data.includes("set_bot_setting")) return;
    bot.deleteMessage(chat_id, mess_id);

    const user = await User.findOne({
        where: {
            user_id: user_id
        }
    });


    if (!user) return bot.sendMessage(chat_id, S(BotDB.get().default_lang, "not_account"));
    const lang = user.lang;
    const Bot = BotDB.get();

    if (!Bot.admins.includes(user_id)) return;
    const sett = data.data.split(" ")[1];
    set_bot[user_id] = sett;
    bot.sendMessage(chat_id, I("edit") + _ + S(lang, "insert_bot_settings")
        .replace(/_NAME_/, sett) ,
        { parse_mode: "Markdown" });
    bot.sendMessage(chat_id , Bot[sett]);
});

bot.on("message", async (data) => {
    const user_id = data.from.id;
    const chat_id = data.chat.id;

    if (!set_bot[user_id]) return;
    const key = set_bot[user_id];
    delete set_bot[user_id];

    const user = await User.findOne({
        where: {
            user_id: user_id
        }
    });
    if (data.text == "/cancel") return;

    if (!user) return bot.sendMessage(chat_id, S(BotDB.get().default_lang, "not_account"));
    const lang = user.lang;
    const Bot = BotDB.get();
    if (!Bot.admins.includes(user_id)) return;
    
    if (!Bot[key]) return;

    Bot.set(key, data.text);
    bot_settings(user_id, chat_id);
});

bot.onText(commandRegexp("general_settings"), async (data) => {
    const user_id = data.from.id;
    const chat_id = data.chat.id;

    bot_settings(user_id, chat_id);
});

module.exports = bot_settings;
