const Partner = require("../models/Partner");
const PickupRequest = require("../models/PickupRequest");
const QrTransaction = require("../models/QrTransaction");
const User = require("../models/User");

const bins = async (req, res, next) => {
  try {
    const items = await Partner.find().lean();
    return res.json(items);
  } catch (error) {
    return next(error);
  }
};

const pickups = async (req, res, next) => {
  try {
    const items = await PickupRequest.find().sort({ createdAt: -1 }).lean();
    return res.json(items);
  } catch (error) {
    return next(error);
  }
};

const updatePickup = async (req, res, next) => {
  try {
    const { pickupId, status } = req.body;
    if (!pickupId || !status) {
      return res.status(400).json({ message: "pickupId and status required" });
    }
    const updated = await PickupRequest.findByIdAndUpdate(
      pickupId,
      { status },
      { new: true }
    );
    return res.json(updated);
  } catch (error) {
    return next(error);
  }
};

const users = async (req, res, next) => {
  try {
    const items = await User.find({ role: "USER" }).lean();
    return res.json(items);
  } catch (error) {
    return next(error);
  }
};

const partners = async (req, res, next) => {
  try {
    const items = await Partner.find().lean();
    return res.json(items);
  } catch (error) {
    return next(error);
  }
};

const analytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: "USER" });
    const totalPartners = await Partner.countDocuments();
    const totalRevenueAgg = await Partner.aggregate([
      { $group: { _id: null, total: { $sum: "$earnings" } } },
    ]);
    const totalRevenue = totalRevenueAgg[0]?.total || 0;
    const totalWasteAgg = await PickupRequest.aggregate([
      { $group: { _id: null, total: { $sum: "$weight" } } },
    ]);
    const totalWaste = totalWasteAgg[0]?.total || 0;

    const now = new Date();
    const last6Months = new Date(now);
    last6Months.setMonth(now.getMonth() - 5);
    const monthly = await QrTransaction.aggregate([
      { $match: { createdAt: { $gte: last6Months } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          total: { $sum: "$pointsGiven" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const category = await PickupRequest.aggregate([
      {
        $group: {
          _id: "$item",
          total: { $sum: "$weight" },
        },
      },
      { $sort: { total: -1 } },
      { $limit: 5 },
    ]);

    const topUsers = await User.find({ role: "USER" })
      .sort({ points: -1 })
      .limit(5)
      .lean();
    const topPartners = await Partner.find()
      .sort({ earnings: -1 })
      .limit(5)
      .lean();

    return res.json({
      totalUsers,
      totalPartners,
      totalWaste,
      totalRevenue,
      monthly,
      category,
      topUsers,
      topPartners,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { bins, pickups, updatePickup, users, partners, analytics };
