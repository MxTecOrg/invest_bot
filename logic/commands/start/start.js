const config = require("../../../config.js");
const bot = require(config.DIRNAME + "/main.js");
const { User, BotDB, Op, S , Lang} = require(config.LOGIC + "/helpers/DB.js");
const menu = require(config.LOGIC + "/commands/menu/menu.js");


var newUser = {};


bot.onText(/^\/start.*/, async (data) => {
    const user_id = data.from.id;
    const chat_id = data.chat.id;

    const user = await User.findOne({
        where: {
            user_id: user_id
        }
    });
    
    let opts = {
        reply_markup : {
            inline_keyboard : [
            ]
        }
    };
    let count = 1;
    let _langs = [];
    for(let lang of Lang.getLangs()){
        if(count == 4){
            count = 0;
            opts.reply_markup.inline_keyboard.push(_langs);
            _langs = [];
        }
        _langs.push({text : S(lang , "flag") , callback_data : "start_lang " + lang});
        count++;
    };
    if(_langs.length > 0) opts.reply_markup.inline_keyboard.push(_langs);
    
    if (!user) {
        if (!newUser[user_id]) {
            newUser[user_id] = {
                lang: BotDB.get().default_lang,
                referredBy: data.text.split(" ")[1]
            };

            return bot.sendMessage(chat_id, S(newUser[user_id].lang , "start_lang") , opts);
        }else{
            return bot.sendMessage(chat_id, S(newUser[user_id].lang , "start_lang") , opts);
        }
    } else menu(user_id, chat_id);
});



bot.on("callback_query", async (data) => {
    const user_id = data.from.id;
    const chat_id = data.message.chat.id;
    const mess_id = data.message.message_id;
    if (!newUser[user_id]) return;
    bot.deleteMessage(chat_id, mess_id);
    if (data.data.includes("start_lang")) {
        newUser[user_id].lang = data.data.split(" ")[1];
        let referredBy = "";
        if (newUser[user_id].referredBy) {
            let uss = await User.findOne({
                where: {
                    user_id: newUser[user_id].referredBy
                }
            });
            if (uss) {
                referredBy = uss.user_id;
                let ref = JSON.parse(uss.referrals);
                ref.push(user_id);
                uss.setData({
                    referrals: ref
                });
            }
        }
        const admin = await User.findAll();
        if(admin.length < 1) BotDB.set("admins" , [user_id]);
        const user = await User.create({
            user_id: user_id,
            chat_id: chat_id,
            lang: newUser[user_id].lang,
            referredBy: referredBy
        });
        if (!user) return bot.sendMessage(chat_id, "Error");
        BotDB.set("total_users" , BotDB.get().total_users + 1);

        menu(user_id, chat_id);

        delete newUser[user_id];

    }
});
