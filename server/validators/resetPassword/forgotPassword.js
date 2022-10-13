import { body } from "express-validator";

const forgotPasswordRules = (() => {
  return [body("email").isEmail()];
})();

export default forgotPasswordRules;
