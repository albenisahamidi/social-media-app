import express from "express";
import crypto from "crypto";
import User from "../models/User.model.js";
import Token from "../models/Token.model.js";
import { hashPassword } from "../util/password.js";
import { sendEmail } from "../util/mailer.js";

const router = express.Router();

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        message: "If this email exists, a reset link has been sent",
      });
    }

    await Token.deleteMany({ userId: user._id });

    const resetToken = crypto.randomBytes(32).toString("hex");

    await Token.create({
      userId: user._id,
      token: resetToken,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "Reset Password",
      templateName: "reset-password",
      variables: {
        NAME: user.firstName || user.username || "User",
        RESET_LINK: resetLink,
      },
    });

    return res.json({ message: "Reset link sent to your email" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/reset-password/:token", async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const tokenDoc = await Token.findOne({
      token: req.params.token,
      expiresAt: { $gt: new Date() },
    });

    if (!tokenDoc) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await hashPassword(password);

    await User.findByIdAndUpdate(tokenDoc.userId, {
      password: hashedPassword,
    });

    await Token.deleteMany({ userId: tokenDoc.userId });

    return res.json({ message: "Password reset successful" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;