const mongoose = require("mongoose");
const Partner = require("../models/Partner");
const PickupRequest = require("../models/PickupRequest");
const QrTransaction = require("../models/QrTransaction");
const User = require("../models/User");

const scanQr = async (req, res, next) => {
  try {
    const { qrCode, partnerId, pointsGiven } = req.body;
    if (!qrCode || !partnerId) {
      return res.status(400).json({ message: "qrCode and partnerId required" });
    }
    if (!mongoose.Types.ObjectId.isValid(partnerId)) {
      return res.status(400).json({ message: "Invalid partnerId" });
    }
    const transaction = await QrTransaction.findOne({ qrCode });
    if (!transaction) {
      return res.status(404).json({ message: "QR not found" });
    }
    if (transaction.pointsGiven > 0) {
      return res.status(400).json({ message: "QR already redeemed" });
    }
    const user = await User.findById(transaction.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const awarded = Number(pointsGiven) || 50;
    transaction.partnerId = partnerId;
    transaction.pointsGiven = awarded;
    await transaction.save();
    user.points += awarded;
    await user.save();
    await Partner.findByIdAndUpdate(partnerId, { $inc: { earnings: awarded } });
    return res.json({ pointsAdded: awarded, userPoints: user.points });
  } catch (error) {
    return next(error);
  }
};

const binStatus = async (req, res, next) => {
  try {
    const { partnerId } = req.query;
    if (!partnerId) {
      return res.status(400).json({ message: "partnerId is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(partnerId)) {
      return res.status(400).json({ message: "Invalid partnerId" });
    }
    const partner = await Partner.findById(partnerId).lean();
    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }
    return res.json({ binFillLevel: partner.binFillLevel });
  } catch (error) {
    return next(error);
  }
};

const transactions = async (req, res, next) => {
  try {
    const { partnerId } = req.query;
    if (!partnerId) {
      return res.status(400).json({ message: "partnerId is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(partnerId)) {
      return res.status(400).json({ message: "Invalid partnerId" });
    }
    const items = await QrTransaction.find({ partnerId })
      .sort({ createdAt: -1 })
      .lean();
    return res.json(items);
  } catch (error) {
    return next(error);
  }
};

const earnings = async (req, res, next) => {
  try {
    const { partnerId } = req.query;
    if (!partnerId) {
      return res.status(400).json({ message: "partnerId is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(partnerId)) {
      return res.status(400).json({ message: "Invalid partnerId" });
    }
    const now = new Date();
    const last7Days = new Date(now);
    last7Days.setDate(now.getDate() - 6);
    const weekly = await QrTransaction.aggregate([
      { $match: { partnerId: new mongoose.Types.ObjectId(partnerId), createdAt: { $gte: last7Days } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          total: { $sum: "$pointsGiven" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const last6Months = new Date(now);
    last6Months.setMonth(now.getMonth() - 5);
    const monthly = await QrTransaction.aggregate([
      { $match: { partnerId: new mongoose.Types.ObjectId(partnerId), createdAt: { $gte: last6Months } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          total: { $sum: "$pointsGiven" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    return res.json({ weekly, monthly });
  } catch (error) {
    return next(error);
  }
};

const requestBinPickup = async (req, res, next) => {
  try {
    const { partnerId, address } = req.body;
    if (!partnerId || !address) {
      return res.status(400).json({ message: "partnerId and address required" });
    }
    if (!mongoose.Types.ObjectId.isValid(partnerId)) {
      return res.status(400).json({ message: "Invalid partnerId" });
    }
    const pickup = await PickupRequest.create({
      requestedBy: partnerId,
      role: "PARTNER",
      item: "Bin Pickup",
      weight: 0,
      address,
    });
    return res.status(201).json(pickup);
  } catch (error) {
    return next(error);
  }
};

module.exports = { scanQr, binStatus, transactions, earnings, requestBinPickup };
