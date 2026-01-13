const express = require("express");
const router = express.Router();

const auth = require("../../middlewares/auth.middleware");

const {
  createECG,
  getECGHistory
} = require("../../controllers/vitals/ecg.controller");

const {
  getECGSummaryHistory
} = require("../../controllers/vitals/ecgSummary.controller");

router.post("/ecg", auth, createECG);
router.get("/ecg", auth, getECGHistory);
router.get("/ecg/summary", auth, getECGSummaryHistory);

module.exports = router;
