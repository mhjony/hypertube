// This file contains all the rules form profileUpdate form validations
import { check, body } from "express-validator";

const updatePrifileRules = (() => {
  return [
    // body("first_name").notEmpty().isAlpha().isLength({ min: 3 }),
    // body("last_name").notEmpty().isAlpha().isLength({ min: 3 }),
    // body("user_name").notEmpty().isLength({ min: 3 }),
    // body("email").isEmail(),
    check("email")
      .trim()
      .normalizeEmail()
      .not()
      .isEmpty()
      .withMessage("Invalid email address!")
      .bail(),
    // body("password")
    //   .optional()
    //   .isLength({ min: 6 })
    //   .withMessage("Password Must Be at Least 6 Characters")
    //   .matches("[0-9]")
    //   .withMessage("Password Must Contain a Number")
    //   .matches("[A-Z]")
    //   .withMessage("Password Must Contain an Uppercase Letter"),
  ];
})();

export default updatePrifileRules;
