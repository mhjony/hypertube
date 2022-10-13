import { body } from "express-validator";

const resetPasswordRules = (() => {
  return [
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password Must Be at Least 6 Characters")
      .matches("[0-9]")
      .withMessage("Password Must Contain a Number")
      .matches("[A-Z]")
      .withMessage("Password Must Contain an Uppercase Letter"),
    body("confirmPassword")
      .isLength({ min: 6 })
      .withMessage("Password Must Be at Least 6 Characters")
      .matches("[0-9]")
      .withMessage("Password Must Contain a Number")
      .matches("[A-Z]")
      .withMessage("Password Must Contain an Uppercase Letter"),
  ];
})();

export default resetPasswordRules;
