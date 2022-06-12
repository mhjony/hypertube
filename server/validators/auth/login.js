import { body } from "express-validator";

exports.rules = (() => {
  return [body("user_name").notEmpty().isLength({ min: 3 })];
})();
