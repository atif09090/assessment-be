import { body } from "express-validator";


// here we can write our validation logic 

export const userRegistrationValidator = [
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
];
