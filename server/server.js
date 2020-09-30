const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const Post = require("./post");
const randomstring = require("randomstring");
app.listen(4000);
app.use(cors());

mongoose.connect("mongodb://localhost/postTest1", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once("open", async () => {
  let count = await Post.countDocuments().exec();
  if (count > 0) return;
  let post = [];

  for (let i = 0; i < 1000; i++) {
    let rString = randomstring.generate(5);
    post.push(Post.create({ rString }));
  }
  Promise.all(post).then(() => console.log("Added Post"));
});

app.get("/searchPost", async (req, res) => {
  const find = req.query.search;
  console.log({ find });
  const results = {};
  try {
    var regexp = new RegExp("^" + find);
    results.results = await Post.find({ rString: regexp }).exec();
    res.send(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

app.get("/post", async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {};

  if (endIndex < (await Post.countDocuments().exec())) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }

  try {
    results.results = await Post.find().limit(limit).skip(startIndex).exec();
    res.send(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});
