const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Partner = require("../models/Partner");
const PickupRequest = require("../models/PickupRequest");
const QrTransaction = require("../models/QrTransaction");
const Reward = require("../models/Reward");
const User = require("../models/User");

dotenv.config();

const runSeed = async () => {
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    Partner.deleteMany({}),
    QrTransaction.deleteMany({}),
    PickupRequest.deleteMany({}),
    Reward.deleteMany({}),
  ]);

  const users = await User.insertMany([
    { name: "Aarav Singh", email: "aarav@eco.com", password: "1234", role: "USER", points: 320 },
    { name: "Diya Sharma", email: "diya@eco.com", password: "1234", role: "USER", points: 220 },
    { name: "Kabir Patel", email: "kabir@eco.com", password: "1234", role: "USER", points: 540 },
    { name: "Meera Joshi", email: "meera@eco.com", password: "1234", role: "USER", points: 150 },
    { name: "Rohan Gupta", email: "rohan@eco.com", password: "1234", role: "USER", points: 80 },
    { name: "Zara Khan", email: "zara@eco.com", password: "1234", role: "USER", points: 410 },
    { name: "Ishaan Verma", email: "ishaan@eco.com", password: "1234", role: "USER", points: 60 },
    { name: "Anaya Das", email: "anaya@eco.com", password: "1234", role: "USER", points: 275 },
    { name: "Vivaan Roy", email: "vivaan@eco.com", password: "1234", role: "USER", points: 95 },
    { name: "Sara Ali", email: "sara@eco.com", password: "1234", role: "USER", points: 180 },
    { name: "Ravi Kumar", email: "hub1@eco.com", password: "1234", role: "PARTNER", points: 0 },
    { name: "Sneha Rao", email: "hub2@eco.com", password: "1234", role: "PARTNER", points: 0 },
    { name: "Arjun Mehta", email: "hub3@eco.com", password: "1234", role: "PARTNER", points: 0 },
    { name: "Neha Iyer", email: "hub4@eco.com", password: "1234", role: "PARTNER", points: 0 },
    { name: "Kiran Das", email: "hub5@eco.com", password: "1234", role: "PARTNER", points: 0 },
    { name: "Admin One", email: "admin1@eco.com", password: "1234", role: "ADMIN", points: 0 },
    { name: "Admin Two", email: "admin2@eco.com", password: "1234", role: "ADMIN", points: 0 },
  ]);

  const partners = await Partner.insertMany([
    { storeName: "GreenDrop Hub", ownerName: "Ravi Kumar", email: "hub1@eco.com", location: { lat: 12.9716, lng: 77.5946 }, binFillLevel: 45, earnings: 520 },
    { storeName: "EcoCycle Point", ownerName: "Sneha Rao", email: "hub2@eco.com", location: { lat: 28.6139, lng: 77.209 }, binFillLevel: 72, earnings: 860 },
    { storeName: "ReTech Center", ownerName: "Arjun Mehta", email: "hub3@eco.com", location: { lat: 19.076, lng: 72.8777 }, binFillLevel: 30, earnings: 300 },
    { storeName: "CleanCircuit Depot", ownerName: "Neha Iyer", email: "hub4@eco.com", location: { lat: 13.0827, lng: 80.2707 }, binFillLevel: 90, earnings: 1200 },
    { storeName: "Urban E-Store", ownerName: "Kiran Das", email: "hub5@eco.com", location: { lat: 22.5726, lng: 88.3639 }, binFillLevel: 55, earnings: 670 },
  ]);

  const userIds = users.filter((u) => u.role === "USER").map((u) => u._id);
  const partnerIds = partners.map((p) => p._id);

  const transactions = Array.from({ length: 20 }).map((_, index) => ({
    qrCode: `QR-SEED-${index + 1}`,
    userId: userIds[index % userIds.length],
    partnerId: partnerIds[index % partnerIds.length],
    pointsGiven: 20 + (index % 5) * 10,
    createdAt: new Date(Date.now() - index * 86400000),
  }));

  await QrTransaction.insertMany(transactions);

  const pickups = await PickupRequest.insertMany([
    { requestedBy: userIds[0], role: "USER", item: "Laptop", weight: 2.4, address: "Bengaluru, Koramangala", status: "Pending" },
    { requestedBy: userIds[1], role: "USER", item: "Smartphone", weight: 0.4, address: "Delhi, South Extension", status: "Approved" },
    { requestedBy: userIds[2], role: "USER", item: "TV", weight: 12, address: "Mumbai, Andheri", status: "Completed" },
    { requestedBy: userIds[3], role: "USER", item: "Router", weight: 0.6, address: "Chennai, Adyar", status: "Pending" },
    { requestedBy: userIds[4], role: "USER", item: "Earbuds", weight: 0.2, address: "Kolkata, Salt Lake", status: "Approved" },
    { requestedBy: userIds[5], role: "USER", item: "Desktop PC", weight: 8, address: "Pune, Hinjewadi", status: "Pending" },
    { requestedBy: partnerIds[0], role: "PARTNER", item: "Bin Pickup", weight: 0, address: "Bengaluru, Indiranagar", status: "Pending" },
    { requestedBy: partnerIds[1], role: "PARTNER", item: "Bin Pickup", weight: 0, address: "Delhi, Saket", status: "Approved" },
    { requestedBy: partnerIds[2], role: "PARTNER", item: "Bin Pickup", weight: 0, address: "Mumbai, Powai", status: "Completed" },
    { requestedBy: partnerIds[3], role: "PARTNER", item: "Bin Pickup", weight: 0, address: "Chennai, T Nagar", status: "Pending" },
  ]);

  await Reward.insertMany([
    { title: "Eco Tote Bag", description: "Reusable tote bag", pointsRequired: 120 },
    { title: "Plant a Tree", description: "Tree plantation in your name", pointsRequired: 200 },
    { title: "Solar Charger", description: "Pocket solar phone charger", pointsRequired: 320 },
    { title: "LED Bulb Pack", description: "Set of 3 energy-saving bulbs", pointsRequired: 150 },
    { title: "Recycled Notebook", description: "Notebook made from recycled paper", pointsRequired: 80 },
  ]);

  console.log("Seed completed", {
    users: users.length,
    partners: partners.length,
    transactions: transactions.length,
    pickups: pickups.length,
  });

  await mongoose.connection.close();
};

runSeed().catch((error) => {
  console.error(error);
  process.exit(1);
});
