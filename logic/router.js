const config = require("../config.js");
const bot = require("../main.js");

require(config.LOGIC + "/commands/start/start.js");
require(config.LOGIC + "/commands/menu/menu.js");
require(config.LOGIC + "/commands/admin/admin.js");
require(config.LOGIC + "/commands/myaccount/myaccount.js");
require(config.LOGIC + "/commands/deposit/deposit.js");
require(config.LOGIC + "/commands/wallet/wallet.js");
require(config.LOGIC + "/commands/withdraw/withdraw.js");
