const config = require("../../../config.js");
const bot = require(config.DIRNAME + "/main.js");
const { User, BotDB, Lang, S, I, Op, commandRegexp } = require(config.LOGIC + "/helpers/DB.js");
const _ = " ";

const broadcast = async (user_id, chat_id) => {

    const user = await User.findOne({
        where: {
            user_id: user_id
        }
    });


    if (!user) return bot.sendMessage(chat_id, S(BotDB.get().default_lang, "not_account"));
    const lang = user.lang;
    const Bot = BotDB.get();
    
    if(!Bot.admins.includes(user_id)) return;

    const opts = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: I("broadcast") + _ + S(lang, "send"), callback_data: "send_broadcast" }
                ]
            ]
        },
        parse_mode: "Markdown"
    };

    const str = I("broadcast") + _ + S(lang, "broadcast") + ": \n\n" +
        S(lang, "broadcast_desc");
    bot.sendMessage(chat_id, str, opts);
};

var _broadcast = {};

bot.on("callback_query", async (data) => {
    const user_id = data.from.id;
    const chat_id = data.message.chat.id;
    const mess_id = data.message.message_id;


    if (data.data != "send_broadcast") return;
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

    _broadcast[user_id] = true;
    bot.sendMessage(chat_id, I("edit") + _ + S(lang, "insert_broadcast"), { parse_mode: "Markdown" });
});

bot.on("message", async (data) => {
    const user_id = data.from.id;
    const chat_id = data.chat.id;

    if (!_broadcast[user_id]) return;

    delete _broadcast[user_id];

    const user = await User.findOne({
        where: {
            user_id: user_id
        }
    });


    if (!user) return bot.sendMessage(chat_id, S(BotDB.get().default_lang, "not_account"));
    const lang = user.lang;
    const Bot = BotDB.get();

    if(!Bot.admins.includes(user_id)) return;
    
    const users = await User.findAll();
    let count = 0;
    const ulength = users.length - 1;
    const bci = setInterval(() => {
        bot.sendMessage(users[count].chat_id , data.text);
        if(count >= ulength) {
            clearInterval(bci);
            return;
        }
        count++;
    } , 100);
        
    
});

bot.onText(commandRegexp("broadcast" , true), async (data) => {
    const user_id = data.from.id;
    const chat_id = data.chat.id;

    broadcast(user_id, chat_id);
});

module.exports = broadcast;
