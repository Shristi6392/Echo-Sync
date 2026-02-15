const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  pointsRequired: { type: Number, required: true },
});

module.exports = mongoose.model("Reward", rewardSchema);
