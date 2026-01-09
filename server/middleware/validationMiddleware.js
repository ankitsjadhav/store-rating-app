const { body, validationResult } = require("express-validator");

const withValidationErrors = (validateValues) => {
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((err) => err.msg);
        return res.status(400).json({ msg: errorMessages[0] });
      }
      next();
    },
  ];
};

const validateRegisterInput = withValidationErrors([
  body("name").notEmpty().withMessage("Name is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must be 8-16 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password must contain at least one special character"),
  body("address")
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ max: 400 })
    .withMessage("Address must be under 400 characters"),
]);

const validateLoginInput = withValidationErrors([
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
]);

const validateStoreInput = withValidationErrors([
  body("name").notEmpty().withMessage("Store name is required"),
  body("email").notEmpty().withMessage("Email is required").isEmail(),
  body("address").notEmpty().withMessage("Address is required"),
]);

const validateRatingInput = withValidationErrors([
  body("value")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
]);

module.exports = {
  validateRegisterInput,
  validateLoginInput,
  validateStoreInput,
  validateRatingInput,
};
