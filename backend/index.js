import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import registerRoute from "./routes/Register.route.js";
import loginRoute from "./routes/Login.route.js";
import postRoute from "./routes/Post.route.js";
import commentRoute from "./routes/Comment.route.js";
import passwordRoute from "./routes/Password.route.js";
import { verifyTransporter } from "./util/mailer.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use("/auth", registerRoute);
app.use("/auth", loginRoute);
app.use("/auth", passwordRoute);
app.use("/posts", postRoute);
app.use("/comments", commentRoute);

app.get("/", (req, res) => {
  res.json({ message: "Backend is running" });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");
    await verifyTransporter();
    app.listen(process.env.PORT || 5001, () => {
      console.log(`Server running on port ${process.env.PORT || 5001}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });