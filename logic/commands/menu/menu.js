const config = require("../../../config.js");
const fs = require("fs");
const bot = require(config.DIRNAME + "/main.js");
const { User, BotDB, Lang, S, I, Op , commandRegexp } = require(config.LOGIC + "/helpers/DB.js");
const _ = " ";

const menu = async (user_id, chat_id) => {

    const user = await User.findOne({
        where: {
            user_id: user_id
        }
    });



    if (!user) return bot.sendMessage(chat_id, "Esta cuenta no existe , use el comando /start para crear una.");

    const lang = user.lang;
    const opts = {
        reply_markup: {
            resize_keyboard: true,
            keyboard: [
                [
                    I("invest") + _ + S(lang , "invest"),
                    S(lang , "status") + _ + I("status")
                ],
                [
                    I("wallet") + _ + S(lang , "wallet"),
                    S(lang , "referral") + _ + I("referral")
                ],
                [
                    I("comunity") + _ + S(lang , "comunity"),
                    S(lang , "settings") + _ + I("settings")
                ]
            ]
        }
    };


    const menu_str = I("menu") + " Menu:";
    bot.sendMessage(chat_id, menu_str, opts);
};


bot.onText(commandRegexp("menu"), async (data) => {
    const user_id = data.from.id;
    const chat_id = data.chat.id;

    menu(user_id, chat_id);
});

module.exports = menu;
