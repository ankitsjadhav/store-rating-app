const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  createUser,
  updateUserRole,
  getSystemStats,
  updateUserPassword,
  deleteUser,
} = require("../controllers/userController");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authMiddleware");
const { validateRegisterInput } = require("../middleware/validationMiddleware");

router.patch("/update-password", authenticateUser, updateUserPassword);

router.use(authenticateUser, authorizePermissions("ADMIN"));

router.get("/", getAllUsers);
router.post("/", validateRegisterInput, createUser);
router.patch("/update-password", updateUserPassword);
router.get("/stats", getSystemStats);
router.patch("/:id/role", updateUserRole);
router.delete("/:id", deleteUser);

module.exports = router;
