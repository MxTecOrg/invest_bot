const config = require("../../../config.js");
const bot = require(config.DIRNAME + "/main.js");
const { User , BotDB , I , S } = require(config.LOGIC + "/helpers/DB.js");

bot.onText(/\/admin/ , async (data) => {
    const user_id = data.from.id;
    const chat_id = data.chat.id;
    if(!BotDB.get("admins").includes(user_id)) return;
    
    const user = await User.findOne({
        where : {
            user_id : user_id
        }
    });
    const lang = user.lang;
    
    bot.sendMessage(chat_id , "Es admin");
});
