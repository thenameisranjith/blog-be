const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const path = require("path");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const commentRoute = require("./routes/comments");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("database connected sucessfully...!");
  } catch (err) {
    console.log(err);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, fn) => {
    fn(null, "images");
  },
  filename: (req, file, fn) => {
    fn(null, req.body.img);
    // fn(null, "image4.jpg");
  },
});

const upload = multer({
  storage: storage,
});

app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("image has been uploaded sucessfully..!");
});

dotenv.config();
app.use(express.json());
// app.use(cors());
app.use("/images", express.static(path.join(__dirname, "/images")));
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoute);

app.listen(process.env.PORT, () => {
  connectDB();
  console.log("App running sucessfully...!", process.env.PORT);
});
