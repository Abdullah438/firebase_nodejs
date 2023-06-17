import express from "express";
import dotenv from "dotenv";
import usersRouter from "./routes/firestore/router.js";
import authRouter from "./routes/auth/router.js";
import storageRouter from "./routes/storage/router.js";
const app = express();
dotenv.config();

// Use json() middleware
app.use(express.json({ limit: "100mb" }));
// Use urlencoded() middleware
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", authRouter);

app.use("/api/users", usersRouter);

app.use("/api/storage", storageRouter);
// Listen to port from .env file
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
