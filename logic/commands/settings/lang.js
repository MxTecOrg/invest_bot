const config = require("../../../config.js");
const bot = require(config.DIRNAME + "/main.js");
const { User, BotDB, Lang, S, I, Op, commandRegexp } = require(config.LOGIC + "/helpers/DB.js");
const _ = " ";

const lang = async (user_id, chat_id) => {

    const user = await User.findOne({
        where: {
            user_id: user_id
        }
    });


    if (!user) return bot.sendMessage(chat_id, S(BotDB.get().default_lang, "not_account"));
    const lang = user.lang;
    const Bot = BotDB.get();

    let opts = {
        reply_markup: {
            inline_keyboard: [
            ]
        }
    };

    let count = 1;
    let _langs = [];
    for (let lang of Lang.getLangs()) {
        if (count == 4) {
            count = 0;
            opts.reply_markup.inline_keyboard.push(_langs);
            _langs = [];
        }
        _langs.push({ text: S(lang, "flag"), callback_data: "language " + lang });
        count++;
    };
    if (_langs.length > 0) opts.reply_markup.inline_keyboard.push(_langs);
    
    bot.sendMessage(chat_id , S(lang , "select_lang") , opts);

};

bot.onText(commandRegexp("language"), async (data) => {
    const user_id = data.from.id;
    const chat_id = data.chat.id;

    lang(user_id, chat_id);
});

bot.on("callback_query", async (data) => {
    const user_id = data.from.id;
    const chat_id = data.message.chat.id;
    const mess_id = data.message.message_id;

    const user = await User.findOne({
        where: {
            user_id: user_id
        }
    });


    
    if (data.data.includes("language")) {
        if (!user) return bot.sendMessage(chat_id, S(BotDB.get().default_lang, "not_account"));

        bot.deleteMessage(chat_id, mess_id);
        let lang = data.data.split(" ")[1];
        console.log(lang);
        await user.setData({
            lang : lang
        });
        
        lang(user_id , chat_id);
    }
});

module.exports = lang;
