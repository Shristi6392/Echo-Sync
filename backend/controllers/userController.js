const Partner = require("../models/Partner");
const PickupRequest = require("../models/PickupRequest");
const QrTransaction = require("../models/QrTransaction");
const Reward = require("../models/Reward");
const User = require("../models/User");

const scan = async (req, res, next) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const wasteOptions = [
      { type: "USB Cables", points: 25 },
      { type: "Smartphone", points: 150 },
      { type: "Wireless Earbuds", points: 45 },
      { type: "Laptop", points: 320 },
    ];
    const selection =
      wasteOptions[Math.floor(Math.random() * wasteOptions.length)];
    user.points += selection.points;
    await user.save();
    await QrTransaction.create({
      qrCode: `AI-${Date.now()}`,
      userId: user._id,
      pointsGiven: selection.points,
    });
    return res.json({
      wasteType: selection.type,
      points: selection.points,
      totalPoints: user.points,
    });
  } catch (error) {
    return next(error);
  }
};

const generateQr = async (req, res, next) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    const qrCode = `QR-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    await QrTransaction.create({
      qrCode,
      userId,
      pointsGiven: 0,
    });
    return res.status(201).json({ qrCode });
  } catch (error) {
    return next(error);
  }
};

const wallet = async (req, res, next) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const transactions = await QrTransaction.find({ userId })
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ points: user.points, transactions });
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

const requestPickup = async (req, res, next) => {
  try {
    const { userId, item, weight, address } = req.body;
    if (!userId || !item || !weight || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const pickup = await PickupRequest.create({
      requestedBy: userId,
      role: "USER",
      item,
      weight,
      address,
    });
    return res.status(201).json(pickup);
  } catch (error) {
    return next(error);
  }
};

const leaderboard = async (req, res, next) => {
  try {
    const topUsers = await User.find({ role: "USER" })
      .sort({ points: -1 })
      .limit(10)
      .lean();
    return res.json(topUsers);
  } catch (error) {
    return next(error);
  }
};

const rewards = async (req, res, next) => {
  try {
    const items = await Reward.find().lean();
    return res.json(items);
  } catch (error) {
    return next(error);
  }
};

const redeem = async (req, res, next) => {
  try {
    const { userId, rewardId } = req.body;
    if (!userId || !rewardId) {
      return res.status(400).json({ message: "userId and rewardId required" });
    }
    const user = await User.findById(userId);
    const reward = await Reward.findById(rewardId);
    if (!user || !reward) {
      return res.status(404).json({ message: "User or reward not found" });
    }
    if (user.points < reward.pointsRequired) {
      return res.status(400).json({ message: "Not enough points" });
    }
    user.points -= reward.pointsRequired;
    await user.save();
    return res.json({ points: user.points });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  scan,
  generateQr,
  wallet,
  partners,
  requestPickup,
  leaderboard,
  rewards,
  redeem,
};
