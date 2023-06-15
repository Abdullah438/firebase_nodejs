import { Router } from "express";
import {
  getAllUsers,
  getSingleUser,
  createUser,
  createMultipleUsers,
  deleteUser,
} from "../../controller/users/controller.js";
import { body } from "express-validator";

const router = Router();

// @route  GET, POST api/users
router
  .route("/")
  .get(getAllUsers)
  .post(
    body("name").notEmpty(),
    body("email").notEmpty().isEmail(),
    createUser,
  );

// @route   POST api/users/bulk
router
  .route("/bulk")
  .post(
    body("*.name").notEmpty(),
    body("*.email").notEmpty().isEmail(),
    createMultipleUsers,
  );

// @route   GET api/users/:id
router.route("/:id").get(getSingleUser);

// @route   DELETE api/users/:id
router.route("/:id").delete(deleteUser);

export default router;
