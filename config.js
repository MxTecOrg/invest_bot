/* Base Config */
const config = {
    URL: "https://mxtecorgmineriabot.glitch.me",
    PORT: process.env.PORT || 8081, //port
    DIRNAME: __dirname, //root folder
    DB: __dirname + "/database", //database
    LOGIC: __dirname + "/logic", //logic 
    TOKEN: (process.env.TOKEN || "5444052736:AAEN8onvyavNoaOIkVd38fjWfN5tGWec_64") ,
    SERVER: { version: "v0.0.1" }
};

module.exports = config;
