const config = require("../../../config.js");
const bot = require(config.DIRNAME + "/main.js");
const { User, BotDB, Lang, Icons, S, I, Op, commandRegexp } = require(config.LOGIC + "/helpers/DB.js");
const _ = " ";

const set_icons = async (user_id, chat_id) => {

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

    const icons = Icons.get();

    for (let icon in icons) {
        opts.reply_markup.inline_keyboard.push([{
            text: (S(lang, icon) != "???" ? S(lang, icon) + " - " + I(icon) : icon + " - " + I(icon)),
            callback_data: "set_icon " + icon
        }]);
    }

    const str = I("icons") + _ + S(lang, "icons") + ": \n\n" +
        S(lang, "icon_desc");
    bot.sendMessage(chat_id, str, opts);
};

var set_icon = {};

bot.on("callback_query", async (data) => {
    const user_id = data.from.id;
    const chat_id = data.message.chat.id;
    const mess_id = data.message.message_id;


    if (!data.data.includes("set_icon")) return;
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
    const icon = data.data.split(" ")[1];
    set_icon[user_id] = icon;
    bot.sendMessage(chat_id, I("edit") + _ + S(lang, "insert_icon")
        .replace(/_ICON_/, I(icon))
        .replace(/_NAME_/, (S(lang, icon) != "???" ? S(lang, icon) : icon)), { parse_mode: "Markdown" });
});

bot.on("message", async (data) => {
    const user_id = data.from.id;
    const chat_id = data.chat.id;

    if (!set_icon[user_id]) return;
    const icon = set_icon[user_id];
    delete set_icon[user_id];

    const user = await User.findOne({
        where: {
            user_id: user_id
        }
    });
    if(data.text == "/cancel") return;

    if (!user) return bot.sendMessage(chat_id, S(BotDB.get().default_lang, "not_account"));
    const lang = user.lang;
    const Bot = BotDB.get();
    const _icons = Icons.get();
    if (!Bot.admins.includes(user_id)) return;

    if(! _icons[icon]) return;
    
    Icons.set(icon , data.text);
    set_icons(user_id , chat_id);
});

bot.onText(commandRegexp("icons" , true), async (data) => {
    const user_id = data.from.id;
    const chat_id = data.chat.id;

    set_icons(user_id, chat_id);
});

module.exports = set_icons;
