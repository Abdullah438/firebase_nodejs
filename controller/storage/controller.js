import { storage } from "../../backend/config.js";
import { uploadString, ref, getDownloadURL } from "firebase/storage";
import { validationResult } from "express-validator";

const uploadFile = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({
      errors: result.array(),
    });
  } else {
    const { base64, filename } = req.body;
    const base64EncodedImageString = base64.split(";base64,").pop();
    uploadString(
      ref(storage, `images/${filename}`),
      base64EncodedImageString,
      "base64",
      {
        contentType: "image/png",
      },
    )
      .then(async (snapshot) => {
        const imageUrl = await getDownloadURL(snapshot.ref);
        res.status(200).json({
          message: "Image uploaded successfully",
          imageUrl: imageUrl,
        });
      })
      .catch((error) => {
        switch (error.code) {
          case "storage/object-not-found":
            // File doesn't exist
            res.status(404).json({
              message: "File not found",
            });
            break;
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            res.status(401).json({
              message: "Looks like you are not logged in, pls login first",
            });
            break;
          case "storage/canceled":
            // User canceled the upload'
            res.status(400).json({
              message: "Upload canceled",
            });
            break;
          default:
            // Unknown error occurred, inspect the server response
            res.status(500).json({
              message: "Unknown error occurred, inspect the server response",
            });
            break;
        }
      });
  }
};

export { uploadFile };
