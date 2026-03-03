const express = require("express");
const roleCheck = require("../middleware/roleCheck");
const {
  scanQr,
  binStatus,
  transactions,
  earnings,
  requestBinPickup,
} = require("../controllers/partnerController");

const router = express.Router();

router.use(roleCheck(["PARTNER"]));

router.post("/scan-qr", scanQr);
router.get("/bin-status", binStatus);
router.get("/transactions", transactions);
router.get("/earnings", earnings);
router.post("/request-bin-pickup", requestBinPickup);

module.exports = router;
