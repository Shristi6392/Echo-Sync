const mongoose = require("mongoose");

const pickupRequestSchema = new mongoose.Schema({
  requestedBy: { type: mongoose.Schema.Types.ObjectId, required: true },
  role: { type: String, enum: ["USER", "PARTNER"], required: true },
  item: { type: String, required: true },
  weight: { type: Number, required: true },
  address: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Completed", "Rejected"],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PickupRequest", pickupRequestSchema);
