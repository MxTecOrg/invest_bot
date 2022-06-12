const config = require("../../../config.js");
const bot = require(config.DIRNAME + "/main.js");
const { User, BotDB, Lang, Icons, S, I, Op, commandRegexp } = require(config.LOGIC + "/helpers/DB.js");
const _ = " ";

const texts = async (user_id, chat_id) => {

    const user = await User.findOne({
        where: {
            user_id: user_id
        }
    });


    if (!user) return bot.sendMessage(chat_id, S(BotDB.get().default_lang, "not_account"));
    const lang = user.lang;
    const Bot = BotDB.get();
    const LANGS = Lang.get();

    if (!Bot.admins.includes(user_id)) return;

    let opts = {
        reply_markup: {
            inline_keyboard: [

            ]
        },
        parse_mode: "Markdown"
    };

    for (let opt in LANGS[lang]) {
        opts.reply_markup.inline_keyboard.push([{
            text: (opt + " - " + (S(lang , opt).length > 10 ? S(lang , opt).substring(0, 9) : S(lang , opt) )),
            callback_data: "set_text " + opt
        }]);
    }

    const str = I("text") + _ + S(lang, "text") + ": \n\n" +
        S(lang, "text_desc");
    bot.sendMessage(chat_id, str, opts);
};

var set_text = {};

bot.on("callback_query", async (data) => {
    const user_id = data.from.id;
    const chat_id = data.message.chat.id;
    const mess_id = data.message.message_id;


    if (!data.data.includes("set_text")) return;
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
    set_text[user_id] = sett;
    await bot.sendMessage(chat_id, I("edit") + _ + S(lang, "insert_text")
        .replace(/_NAME_/, sett) ,
        { parse_mode: "Markdown" });
    bot.sendMessage(chat_id , S(lang , sett));
});

bot.on("message", async (data) => {
    const user_id = data.from.id;
    const chat_id = data.chat.id;

    if (!set_text[user_id]) return;
    const key = set_text[user_id];
    delete set_text[user_id];

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
    
    if (S(lang , key) == "???") return;

    Lang.set(lang , key, data.text);
    texts(user_id, chat_id);
});

bot.onText(commandRegexp("text"), async (data) => {
    const user_id = data.from.id;
    const chat_id = data.chat.id;

    texts(user_id, chat_id);
});

module.exports = bot_settings;
