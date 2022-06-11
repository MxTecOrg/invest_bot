const config = require("../config.js");
const bot = require("../main.js");

require(config.LOGIC + "/commands/start/start.js");
require(config.LOGIC + "/commands/menu/menu.js");
require(config.LOGIC + "/commands/admin/admin.js");
require(config.LOGIC + "/commands/myaccount/myaccount.js");
require(config.LOGIC + "/commands/deposit/deposit.js");
require(config.LOGIC + "/commands/wallet/wallet.js");
require(config.LOGIC + "/commands/withdraw/withdraw.js");
require(config.LOGIC + "/commands/referral/referral.js");
require(config.LOGIC + "/commands/stadistics/stadistics.js");
require(config.LOGIC + "/commands/calc/calc.js");
require(config.LOGIC + "/commands/support/support.js");
require(config.LOGIC + "/commands/settings/settings.js");
