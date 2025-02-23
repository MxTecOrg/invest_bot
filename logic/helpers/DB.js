const config = require("../../config.js");
const { Sequelize, Model, DataTypes, Op } = require("sequelize");
const fs = require("fs");
const UserModel = require("./models/User.js");

/**********************
 * Iniciando Conexion *
 **********************/
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: config.DB + '/database.db',
    logging: false
});

(async () => {
    try {
        await sequelize.authenticate();
    } catch (err) {
        throw new Error("" + err)
    }
})();

/*********************
 * Modelo de Usuario *
 *********************/
class User extends Model {
    getData() {
        const rows = [];
        let ret = {};
        for (let row of rows) {
            if (this[row]) {
                try {
                    ret[row] = JSON.parse(this[row]);
                } catch (err) {
                    ret[row] = this[row];
                }
            }
        }
        return ret;
    }

    async setData(obj) {
        let parsedObj = {};
        for (let o in obj) {
            if (this[o] == undefined) continue;
            parsedObj[o] = (typeof(obj[o]) === "object" ? JSON.stringify(obj[o]) : obj[o]);
        }
        try {
            await this.update(parsedObj);
            return true;
        } catch (err) {
            console.err(err);
            return false;
        }
    }
}

User.init(
    UserModel(DataTypes),
    {
        sequelize
    }
);

(async () => {
    await User.sync();
})();

/*******************
 * Database de Bot *
 *******************/
var bot_db;

const _load = () => {
    bot_db = JSON.parse(fs.readFileSync(config.DB + "/bot.json", "utf-8"));
};

const _get = () => {
    return bot_db;
};

const _set = (key, value) => {
    let v;
    try {
        v = JSON.parse(value);
    } catch (err) {
        v = value;
    }
    bot_db[key] = v;
    try {
        fs.writeFileSync(config.DB + "/bot.json", JSON.stringify(bot_db), "utf-8");
    } catch (err) {
        console.error(err);
    }
};

/********************
 * Database de Lang *
 ********************/
var langs = {};

const load_langs = () => {
    const _langs = fs.readdirSync(config.DB + "/langs/");
    for (let l of _langs) {
        try {
            langs[l.replace(".json", "")] = JSON.parse(fs.readFileSync(config.DB + "/langs/" + l, "utf-8"));
        } catch (err) {
            console.log(err);
        }
    }
};

const getLangs = () => {
    return Object.keys(langs);
};

const getLangsData = () => {
    return langs;
};

const setLangData = (lang, key, value) => {
    langs[lang][key] = value;
    try {
        fs.writeFileSync(config.DB + "/langs/" + lang + ".json", JSON.stringify(langs[lang]), "utf-8");
    } catch (err) {
        console.error(err);
    }
};

const S = (lang, key) => {

    return (langs[lang] ? (langs[lang][key] ? langs[lang][key] : "???") : "???");
};


/*********************
 * Database de icons *
 *********************/
var icons;

const iload = () => {
    icons = JSON.parse(fs.readFileSync(config.DB + "/icons.json", "utf-8"));
};

const getIconsData = () => {
    return icons;
};

const setIconData = (key, value) => {
    icons[key] = value;
    try {
        fs.writeFileSync(config.DB + "/icons.json", JSON.stringify(icons), "utf-8");
    } catch (err) {
        console.error(err);
    }
};

const I = (icon) => {
    return (icons[icon] ? icons[icon] : "❓");
};


const commandRegexp = (command, _right) => {
    let reg = "(\/" + command;
    for (let lang in langs) {
        const str = S(lang, command);
        let left = (_right ? "" : I(command) + " ");
        let right = (_right ? " " + I(command) : "");
        reg += (str != "???" ? "|" + left + str + right : "");

    }
    reg += ")";
    return new RegExp(reg, "i");
};

module.exports = {
    User,
    BotDB: {
        load: _load,
        set: _set,
        get: _get
    },
    Lang: {
        getLangs,
        get: getLangsData,
        load: load_langs,
        set: setLangData
    },
    Icons: {
        load: iload,
        get: getIconsData,
        set: setIconData
    },
    S,
    I,
    commandRegexp,
    Op
}