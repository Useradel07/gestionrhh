const express = require("express");
const {
  login,
  getProfile,
  changePassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
router.post("/login", login);
router.get("/profile", protect, getProfile);
router.put("/change-password", protect, changePassword);
module.exports = router;
