import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../../backend/config.js";
import { validationResult } from "express-validator";

// Create new firebase user
const createUser = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({
      errors: result.formatWith(({ msg }) => msg).mapped(),
    });
  } else {
    const { email, password } = req.body;
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      return res.status(200).json({
        message: `User created successfully`,
        user: userCredential.user, // Firebase user object
      });
    } catch (error) {
      return res.status(400).json({
        errors: [
          {
            message: error.message,
          },
        ],
      });
    }
  }
};

// Sign in firebase user
const signInUser = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({
      errors: result.formatWith(({ msg }) => msg).mapped(),
    });
  } else {
    const { email, password } = req.body;
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      return res.status(200).json({
        message: `User signed in successfully`,
        user: userCredential.user, // Access token
      });
    } catch (error) {
      res.status(400).json({
        errors: [
          {
            message: error.message,
          },
        ],
      });
    }
  }
};

// Sign out firebase user
const signOutUser = async (req, res) => {
  try {
    await signOut(auth);
    return res.status(200).json({
      message: `User signed out successfully`,
    });
  } catch (error) {
    res.status(400).json({
      errors: [
        {
          message: error.message,
        },
      ],
    });
  }
};

export { createUser, signInUser, signOutUser };
