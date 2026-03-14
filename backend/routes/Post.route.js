import express from "express";
import Post from "../models/Post.model.js";
import PostLike from "../models/PostLike.model.js";
import authMiddleware from "../middleware/Auth.middleware.js";
import upload from "../middleware/Multer.middleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ isActive: true })
      .populate("user", "firstName lastName username email avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({ isActive: true });

    const postsWithLikes = await Promise.all(
      posts.map(async (post) => {
        const likesCount = await PostLike.countDocuments({ post: post._id });

        return {
          ...post.toObject(),
          likesCount,
        };
      })
    );

    return res.json({
      posts: postsWithLikes,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/my-posts", authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find({
      user: req.user._id,
      isActive: true,
    })
      .populate("user", "firstName lastName username email avatar")
      .sort({ createdAt: -1 });

    const postsWithLikes = await Promise.all(
      posts.map(async (post) => {
        const likesCount = await PostLike.countDocuments({ post: post._id });

        return {
          ...post.toObject(),
          likesCount,
        };
      })
    );

    return res.json({ posts: postsWithLikes });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const post = await Post.create({
      user: req.user._id,
      content,
      image,
    });

    const populatedPost = await Post.findById(post._id).populate(
      "user",
      "firstName lastName username email avatar"
    );

    return res.status(201).json({
      message: "Post created successfully",
      post: populatedPost,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post || !post.isActive) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    post.content = content || post.content;
    await post.save();

    return res.json({
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post || !post.isActive) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    post.isActive = false;
    await post.save();

    return res.json({ message: "Post deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/:id/like", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post || !post.isActive) {
      return res.status(404).json({ message: "Post not found" });
    }

    const existingLike = await PostLike.findOne({
      user: req.user._id,
      post: post._id,
    });

    if (existingLike) {
      await PostLike.deleteOne({ _id: existingLike._id });

      const likesCount = await PostLike.countDocuments({ post: post._id });

      return res.json({
        message: "Post unliked",
        liked: false,
        likesCount,
      });
    }

    await PostLike.create({
      user: req.user._id,
      post: post._id,
    });

    const likesCount = await PostLike.countDocuments({ post: post._id });

    return res.json({
      message: "Post liked",
      liked: true,
      likesCount,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;