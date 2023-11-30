const exprees = require("express");
const router = exprees.Router();
const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const verifyToken = require("../verifyToken");

router.post("/write-cmt", verifyToken, async (req, res) => {
  try {
    const newComment = new Comment(req.body);
    const saveComment = await newComment.save();
    res.status(200).json(saveComment);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.put("/:id", async (req, res) => {
  console.log("19 ", req.params.id, req.body);
  try {
    const updateComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updateComment);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const result = await Comment.findById(req.params.id);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json("Comment has been deleted");
  } catch (err) {
    res.status(500).json(err.message);
  }
});

/* GET POSTS commentes */

router.get("/post/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;
