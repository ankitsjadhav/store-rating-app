const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  createUser,
  updateUserRole,
} = require("../controllers/userController");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authMiddleware");
const { validateRegisterInput } = require("../middleware/validationMiddleware");

router.use(authenticateUser, authorizePermissions("ADMIN"));

router.get("/", getAllUsers);
router.post("/", validateRegisterInput, createUser);
router.patch("/:id/role", updateUserRole);

module.exports = router;
