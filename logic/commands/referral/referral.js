const config = require("../../../config.js");
const bot = require(config.DIRNAME + "/main.js");
const { User, BotDB, Lang, S, I, Op, commandRegexp } = require(config.LOGIC + "/helpers/DB.js");
const _ = " ";


const referral = async (user_id, chat_id) => {

    const user = await User.findOne({
        where: {
            user_id: user_id
        }
    });


    if (!user) return bot.sendMessage(chat_id, S(BotDB.get().default_lang, "not_account"));
    const lang = user.lang;
    const Bot = BotDB.get();
    const ref_link = "https://t.me/" + Bot.name + "?start=" + user_id;
    const ref = JSON.parse(user.referrals).length;
    const ref_lvl = Bot.ref_levels;
    const ref_earn = Bot.ref_earns.join("%|");


    const opts = {
        parse_mode: "MarkdownV2"
    };

    const str = I("referral") + _ + S(lang , "referral") + ": \n\n" +
        S(lang, "referral_desc")
        .replace(/_REF_LINK_/g, ref_link)
        .replace(/_REF_/g, ref)
        .replace(/_REF_LVL_/g, ref_lvl)
        .replace(/_REF_EARN_/g, ref_earn);
    bot.sendMessage(chat_id, str, opts);
};

bot.onText(commandRegexp("referral") , async(data) => {
    const user_id = data.from.id;
    const chat_id = data.chat.id;
    
    referral(user_id, chat_id);
});

module.exports = referral;
