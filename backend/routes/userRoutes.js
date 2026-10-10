const express = require("express");
const {
  getUsers,
  createEmployeeUser,
} = require("../controllers/userController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const router = express.Router();
router.get("/", protect, adminOnly, getUsers);
router.post("/employee", protect, adminOnly, createEmployeeUser);
module.exports = router;
