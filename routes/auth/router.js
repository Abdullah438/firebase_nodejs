import {
  createUser,
  signInUser,
  signOutUser,
} from "../../controller/auth/controller.js";
import { body } from "express-validator";
import { Router } from "express";

const router = Router();

const mustHaveNumber = /^(?=.*\d)/;
const mustHaveLowercaseLetter = /^(?=.*[a-z])/;
const mustHaveUppercaseLetter = /^(?=.*[A-Z])/;
const mustBe8Chars = /^[0-9a-zA-Z]{8,}$/;
router
  .route("/register")
  .post(
    body("email").isEmail().withMessage("Email is not valid"),
    body("password")
      .matches(mustBe8Chars)
      .withMessage("Must be at least 8 characters long")
      .matches(mustHaveNumber)
      .withMessage("Must have a number")
      .matches(mustHaveLowercaseLetter)
      .withMessage("Must have a lowercase letter")
      .matches(mustHaveUppercaseLetter)
      .withMessage("Must have an uppercase letter"),
    createUser,
  );

router
  .route("/login")
  .post(
    body("email").isEmail().withMessage("Email is not valid"),
    body("password").notEmpty().withMessage("Password is required"),
    signInUser,
  );

router.route("/logout").delete(signOutUser);
export default router;
