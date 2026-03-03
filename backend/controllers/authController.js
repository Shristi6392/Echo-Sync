const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const Partner = require("../models/Partner");
const User = require("../models/User");

const HASH_PREFIX = "pbkdf2";
const HASH_ITERATIONS = 120000;
const HASH_KEYLEN = 64;
const HASH_DIGEST = "sha512";
const JWT_SECRET = process.env.JWT_SECRET || "eco_sync_secret";
const JWT_EXPIRES_IN = "7d";

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, HASH_ITERATIONS, HASH_KEYLEN, HASH_DIGEST)
    .toString("hex");
  return `${HASH_PREFIX}$${HASH_ITERATIONS}$${salt}$${hash}`;
};

const isHashedPassword = (value) =>
  typeof value === "string" && value.startsWith(`${HASH_PREFIX}$`);

const verifyPassword = (password, stored) => {
  if (!isHashedPassword(stored)) {
    return stored === password;
  }
  const parts = stored.split("$");
  if (parts.length !== 4) {
    return false;
  }
  const [, iterations, salt, hash] = parts;
  const derived = crypto
    .pbkdf2Sync(
      password,
      salt,
      Number(iterations),
      HASH_KEYLEN,
      HASH_DIGEST
    )
    .toString("hex");
  if (hash.length !== derived.length) {
    return false;
  }
  return crypto.timingSafeEqual(
    Buffer.from(hash, "hex"),
    Buffer.from(derived, "hex")
  );
};

const createToken = (user) =>
  jwt.sign(
    {
      userId: user._id,
      role: user.role,
      email: user.email,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

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
    const user = await User.create({
      name,
      email,
      password: hashPassword(password),
      role,
    });
    const responseUser = user.toObject();
    delete responseUser.password;
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
    const token = createToken(responseUser);
    return res.status(201).json({ user: responseUser, token });
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
    const user = await User.findOne({ email });
    if (!user || !verifyPassword(password, user.password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (!isHashedPassword(user.password)) {
      user.password = hashPassword(password);
      await user.save();
    }
    const responseUser = user.toObject();
    delete responseUser.password;
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
    const token = createToken(responseUser);
    return res.json({ user: responseUser, token });
  } catch (error) {
    return next(error);
  }
};

module.exports = { signup, login };
