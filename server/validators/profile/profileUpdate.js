// This file contains all the rules form profileUpdate form validations
import { body } from "express-validator";

const updateProfileRules = (() => {
  return [
    body("first_name").notEmpty().isAlpha().isLength({ min: 3 }),
    body("last_name").notEmpty().isAlpha().isLength({ min: 3 }),
    body("user_name").notEmpty().isLength({ min: 3 }),
    body("email").isEmail(),
  ];
})();

export default updateProfileRules;
