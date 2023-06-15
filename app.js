import express from "express";
import dotenv from "dotenv";
import usersRouter from "./routes/users/router.js";
import authRouter from "./routes/auth/router.js";
import { createUser } from "./controller/auth/controller.js";
const app = express();
dotenv.config();

// Use json() middleware
app.use(express.json());
// Use urlencoded() middleware
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", authRouter);

app.use("/api/users", usersRouter);
// Listen to port from .env file
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
