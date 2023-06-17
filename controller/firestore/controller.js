import { db, auth } from "../../backend/config.js";
import {
  doc,
  setDoc,
  updateDoc,
  writeBatch,
  getDoc,
  getDocs,
  collection,
  deleteDoc,
} from "firebase/firestore";
import { validationResult } from "express-validator";
import { v4 as uuidv4 } from "uuid";
// Create a new user
const createUser = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({
      errors: result.array(),
    });
  } else {
    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("User is signed in");
      } else {
        console.log("User is not signed in");
      }
    });

    if (auth.currentUser != null) {
      const body = {
        id: uuidv4(),
        name: req.body.name,
        email: req.body.email,
      };
      await setDoc(doc(db, "Users", body.id), body);
      await storage.init();
      const accessToken = await storage.getItem("access-token");
      res.setHeader("Authorization", `Bearer ${accessToken}`);
      res.status(201).json({
        message: "User created successfully",
      });
    } else {
      res.status(401).json({
        code: 401,
        message: "Unauthorized access",
      });
    }
  }
};

// Create multiple users
const createMultipleUsers = async (req, res) => {
  const users = req.body;
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({
      errors: result.array(),
    });
  } else {
    if (auth.currentUser != null) {
      const batch = writeBatch(db);
      const extendedUsers = users.map((user) => {
        return {
          id: uuidv4(),
          name: user.name,
          email: user.email,
        };
      });
      extendedUsers.forEach((user) => {
        const userRef = doc(db, "Users", user.id);
        batch.set(userRef, user);
      });
      batch
        .commit()
        .then(() => {
          res.status(201).json({
            message: "Users created successfully",
          });
        })
        .catch((error) => {
          res.status(400).json({
            message: error.message,
          });
        });
    }
    {
      res.status(401).json({
        code: 401,
        message: "Unauthorized access",
      });
    }
  }
};


// Get all users
const getAllUsers = async (req, res) => {
  const users = [];
  const querySnapshot = await getDocs(collection(db, "Users"));
  querySnapshot.forEach((doc) => {
    users.push(doc.data());
  });
  res.status(200).json(users);
};

// Get a single user
const getSingleUser = async (req, res) => {
  const id = req.params.id;
  const docRef = doc(db, "Users", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    res.status(200).json(docSnap.data());
  } else {
    res.status(404).json({
      message: "User not found",
    });
  }
};

// UPDATE a user by id

const updateUser = async (req, res) => {
  const id = req.params.id;
  const docRef = doc(db, "Users", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    await updateDoc(docRef, req.body);
    res.status(200).json({
      message: "User updated successfully",
    });
  } else {
    res.status(404).json({
      message: "Can't update user as it doesn't exist",
    });
  }
};

// Delete a user by id
const deleteUser = async (req, res) => {
  const id = req.params.id;
  const docRef = doc(db, "Users", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    await deleteDoc(docRef);
    res.status(200).json({
      message: "User deleted successfully",
    });
  } else {
    res.status(404).json({
      message: "Can't delete user as it doesn't exist",
    });
  }
};

export {
  getAllUsers,
  getSingleUser,
  createUser,
  createMultipleUsers,
  updateUser,
  deleteUser,
};
