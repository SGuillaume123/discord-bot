const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  userId: { type: String, require: true, unique: true },
  serverId: { type: String, require: true },
  rizzCoins: { type: Number, default: 10 },
  dailyLastUsed: { type: Number, default: 0 },
  coinflipLastUsed: { type: Number, default: 0 },
});

const model = mongoose.model("RizzDB", profileSchema);

module.exports = model;
