const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../middleware/validationMiddleware");

router.get("/test", (req, res) => {
  res.json({ msg: "Auth route is working!" });
});
router.post("/register", validateRegisterInput, register);
router.post("/login", validateLoginInput, login);

module.exports = router;
