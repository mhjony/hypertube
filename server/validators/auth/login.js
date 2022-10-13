import { body } from "express-validator";

const loginRules = (() => {
  return [body("user_name").notEmpty().isLength({ min: 3 })];
})();

export default loginRules;
