import { Router } from "express";
import { uploadFile } from "../../controller/storage/controller.js";
import { body } from "express-validator";

const router = Router();

router
  .route("/upload")
  .post(
    body("base64").notEmpty().withMessage("Base64 is required"),
    body("filename").notEmpty().withMessage("Filename is required"),
    uploadFile,
  );

export default router;
