const Partner = require("../models/Partner");
const User = require("../models/User");

const signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }
    const user = await User.create({ name, email, password, role });
    const responseUser = user.toObject();
    if (role === "PARTNER") {
      const partner = await Partner.create({
        storeName: `${name} Hub`,
        ownerName: name,
        email,
        location: {
          lat: 20.5937 + Math.random(),
          lng: 78.9629 + Math.random(),
        },
        binFillLevel: 20,
        earnings: 0,
      });
      responseUser.partnerId = partner._id;
    }
    return res.status(201).json(responseUser);
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const responseUser = user.toObject();
    if (user.role === "PARTNER") {
      let partner = await Partner.findOne({ email });
      if (!partner) {
        partner = await Partner.create({
          storeName: `${user.name} Hub`,
          ownerName: user.name,
          email,
          location: {
            lat: 20.5937 + Math.random(),
            lng: 78.9629 + Math.random(),
          },
          binFillLevel: 15,
          earnings: 0,
        });
      }
      responseUser.partnerId = partner._id;
    }
    return res.json(responseUser);
  } catch (error) {
    return next(error);
  }
};

module.exports = { signup, login };
