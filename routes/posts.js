const exprees = require("express");
const router = exprees.Router();
const Post = require("../models/Post");
const Comment = require("../models/Comment");

router.post("/write-post", async (req, res) => {
  try {
    const newPost = new Post(req.body);
    const savePost = await newPost.save();
    res.status(200).json(savePost);
  } catch (err) {
    res.status(500).json(err.message);
    console.log("err message====> ", err.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updateUser = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updateUser);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    await Comment.deleteMany({ postId: req.params.id });
    res.status(200).json("post has been deleted");
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.get("/", async (req, res) => {
  /* for search filter  */
  const query = req.query;

  try {
    const searchFilter = { title: { $regex: query.search, $options: "i" } };
    const post = await Post.find(query.search ? searchFilter : null);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

/* GET POSTS DETAILS */

router.get("/user/:userId", async (req, res) => {
  try {
    const post = await Post.find({ userId: req.params.userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const result = await Post.findById(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;
