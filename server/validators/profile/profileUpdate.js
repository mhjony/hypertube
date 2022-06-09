// This file contains all the rules form userUpdate form validations

// To-do: Make sure this matched with incoming data: first_name, last_name, email, avatar
const { body } = require("express-validator");

exports.rules = (() => {
  return [
    body("first_name").notEmpty().isAlpha().isLength({ min: 3 }),
    body("last_name").notEmpty().isAlpha().isLength({ min: 3 }),
    // body('user_name').notEmpty().isLength({ min: 3 }),
    body("gender").notEmpty().isAlpha(),
    body("email").isEmail(),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password Must Be at Least 6 Characters")
      .matches("[0-9]")
      .withMessage("Password Must Contain a Number")
      .matches("[A-Z]")
      .withMessage("Password Must Contain an Uppercase Letter"),
  ];
})();
