const express = require("express");
const roleCheck = require("../middleware/roleCheck");
const {
  bins,
  pickups,
  updatePickup,
  users,
  partners,
  analytics,
} = require("../controllers/adminController");

const router = express.Router();

router.use(roleCheck(["ADMIN"]));

router.get("/bins", bins);
router.get("/pickups", pickups);
router.put("/update-pickup", updatePickup);
router.get("/users", users);
router.get("/partners", partners);
router.get("/analytics", analytics);

module.exports = router;
