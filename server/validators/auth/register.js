import { body } from "express-validator";

const registerRules = (() => {
  return [
    body("first_name").notEmpty().isAlpha().isLength({ min: 1 }).withMessage("Firstname Can not be empty"),
    body("last_name").notEmpty().isAlpha().isLength({ min: 1 }).withMessage("Firstname Can not be empty"),
    body("user_name")
		.notEmpty()
		.isLength({ min: 3 })
		.withMessage("Username need to be 3 Characters long"),
    body("email").isEmail(),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password Must Be at Least 6 Characters")
      .matches("[0-9]")
      .withMessage("Password Must Contain a Number")
      .matches("[A-Z]")
      .withMessage("Password Must Contain an Uppercase Letter")
      .matches('[!@#$%^&*(),.?":{}|<>]')
      .withMessage("Password Must Contain a Special Character"),
  ];
})();

export default registerRules;
