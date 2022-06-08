const config = require("../../../config.js");
const fs = require("fs");
const bot = require(config.DIRNAME + "/main.js");
const { User, BotDB , Lang , S , Op } = require(config.LOGIC + "/helpers/DB.js");


const menu = async (user_id, chat_id) => {
    const opts = {
        reply_markup: {
            resize_keyboard: true,
            keyboard: [
                [
                    "💻 Invertir",
                    "Estado 🧮"
                ],
                [
                    "💳 Retirar",
                    "Referidos 👤"
                ],
                [
                    "💌 Comunidad",
                    "Ajustes ⚙️"
                ]
            ]
        }
    };

    const user = await User.findOne({
        where: {
            user_id: user_id
        }
    });

    

    if (!user) return bot.sendMessage(chat_id, "Esta cuenta no existe , use el comando /start para crear una.");

    const menu_str = "💻 Menu:";
    bot.sendMessage(chat_id, menu_str, opts);
};

bot.onText(/(\/menu| Atrás ↩️)/, async (data) => {
    const user_id = data.from.id;
    const chat_id = data.chat.id;

    menu(user_id, chat_id);
});

module.exports = menu;
