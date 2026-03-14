import express from "express";
import Comment from "../models/Comment.model.js";
import authMiddleware from "../middleware/Auth.middleware.js";

const router = express.Router();

router.get("/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({
      post: req.params.postId,
    })
      .populate("user", "firstName lastName username avatar")
      .sort({ createdAt: -1 });

    res.json({ comments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/:postId", authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;

    const comment = await Comment.create({
      user: req.user._id,
      post: req.params.postId,
      content,
    });

    const populatedComment = await Comment.findById(comment._id).populate(
      "user",
      "firstName lastName username avatar"
    );

    res.status(201).json({
      message: "Comment added",
      comment: populatedComment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await Comment.deleteOne({ _id: comment._id });

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;