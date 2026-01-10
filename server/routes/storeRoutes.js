const express = require("express");
const router = express.Router();
const {
  createStore,
  getAllStores,
  submitRating,
  getMyStores,
  deleteStore,
} = require("../controllers/storeController");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authMiddleware");
const {
  validateStoreInput,
  validateRatingInput,
} = require("../middleware/validationMiddleware");

router.get("/", authenticateUser, getAllStores);
router.post(
  "/:storeId/rate",
  authenticateUser,
  authorizePermissions("USER"),
  validateRatingInput,
  submitRating
);
router.get(
  "/my-dashboard",
  authenticateUser,
  authorizePermissions("STORE_OWNER", "ADMIN"),
  getMyStores
);
router.post(
  "/",
  authenticateUser,
  authorizePermissions("ADMIN"),
  validateStoreInput,
  createStore
);

router.delete(
  "/:id",
  authenticateUser,
  authorizePermissions("ADMIN"),
  deleteStore
);

module.exports = router;
