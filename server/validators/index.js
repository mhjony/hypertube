import { check, validationResult } from "express-validator";

// const validate = (req, res, next) => {
//   const errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     console.log(errors);
//     return res.status(400).json({ errors: errors.array() });
//   }
//   next();
// };

// export default validate;

const validator = [
  check("email")
    .trim()
    .normalizeEmail()
    .not()
    .isEmpty()
    .withMessage("Invalid email address!")
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];

export default validator;
