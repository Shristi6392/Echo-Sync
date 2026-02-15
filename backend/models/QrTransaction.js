const mongoose = require("mongoose");

const qrTransactionSchema = new mongoose.Schema({
  qrCode: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  partnerId: { type: mongoose.Schema.Types.ObjectId, ref: "Partner" },
  pointsGiven: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("QrTransaction", qrTransactionSchema);
