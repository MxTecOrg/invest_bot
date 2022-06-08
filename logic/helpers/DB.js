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
    loggin: false
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
            parsedObj[o] = (typeof(obj) === "object" ? JSON.stringify(obj[o]) : obj[o]);
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
    bot_db = JSON.parse(fs.readFileSync(config.DB + "/bot.json" , "utf-8"));
};

const _get = () => {
    return bot_db;
};

const _set = (key , value) => {
    bot_db[key] = value;
    try{
        fs.writeFileSync(config.DB + "/bot.json" , JSON.stringify(bot_db) , "utf-8");
    }catch(err){
        console.error(err);
    }
};

/********************
 * Database de Lang *
 ********************/
var langs = {};

const load_langs = () => {
    const _langs = fs.readDirSync(config.LOGIC + "/langs/");
    for(let l of _langs){
        try{
            langs[l.replace(".json" , "")] = fs.readFileSync(config.DB + "/langs/" + l);
        }catch(err){
            console.log(err);
        }
    }
};

const getLangs = () => {
    return Object.keys(langs);
};

const S = (lang , key) => {
    return (langs[lang] ? (langs[lang][key] ? langs[lang][key] : "???") : "???");
};

module.exports = {
    User,
    BotDB : {
        load : _load,
        set : _set,
        get : _get
    },
    Lang : {
        getLangs,
        load
    },
    S,
    Op
}
