const express = require("express");
const roleCheck = require("../middleware/roleCheck");
const {
  scan,
  generateQr,
  wallet,
  partners,
  requestPickup,
  leaderboard,
  rewards,
  redeem,
} = require("../controllers/userController");

const router = express.Router();

router.use(roleCheck(["USER"]));

router.post("/scan", scan);
router.post("/generate-qr", generateQr);
router.get("/wallet", wallet);
router.get("/partners", partners);
router.post("/request-pickup", requestPickup);
router.get("/leaderboard", leaderboard);
router.get("/rewards", rewards);
router.post("/redeem", redeem);

module.exports = router;
