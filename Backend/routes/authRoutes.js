const express = require("express");
const {
  register,
  login,
  verifyEmail,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const { getUserProfile } = require("../controllers/authController");
const { deleteAllUsers } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify/:token", verifyEmail);
router.get("/profile", authMiddleware, getUserProfile);
router.delete("/delete-all", deleteAllUsers);

module.exports = router;
