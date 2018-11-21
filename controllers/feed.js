const fs = require("fs");
const path = require("path");

const { validationResult } = require("express-validator/check");

const Post = require("../models/post");
const User = require("../models/user");

// Get Posts list 取得所有文章資料
exports.getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;

  try {
    const totalItems = await Post.find().countDocuments();
    const posts = await Post.find()
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      message: "成功取得文章資料.",
      posts: posts,
      totalItems: totalItems
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
// Created Post 新增文章
exports.createPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // 自訂錯誤訊息，傳遞給自訂的錯誤處理中間件
    const error = new Error("資料驗證失敗，格式錯誤！");
    error.statusCode = 422;
    throw error; // 這裡將會傳到下方的.catch(err)
  }

  if (!req.file) {
    const error = new Error("沒有提供照片");
    error.statusCode = 422;
    throw error;
  }
  const imageUrl = req.file.path;
  const title = req.body.title;
  const content = req.body.content;
  let creator;
  // 新增資料到資料庫
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: req.userId
  });

  try {
    await post.save();
    const user = await User.findById(req.userId);
    user.posts.push(post);
    await user.save();
    res.status(201).json({
      message: "文章創建成功!",
      post: post,
      creator: { _id: user._id, name: user.name }
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Get Post 取得單一文章
exports.getPost = async (req, res, next) => {
  const postId = req.params.postId;
  // 用postId搜尋資料庫post文章
  const post = await Post.findById(postId);
  try {
    if (!post) {
      const error = new Error("沒有找到該篇文章");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: "已取得文章資料", post: post });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// PUT/Update Post 更新文章
exports.updatePost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // 自訂錯誤訊息，傳遞給自訂的錯誤處理中間件
    const error = new Error("資料驗證失敗，格式錯誤！");
    error.statusCode = 422;
    throw error;
  }
  const postId = req.params.postId;
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  // 如果本次更新有接收到另外上傳的新圖片，就更新imageUrl
  if (req.file) {
    imageUrl = req.file.path;
  }
  // 如果沒有收到舊的圖片路徑，也沒有新的，就回傳報錯
  if (!imageUrl) {
    const error = new Error("沒有設置圖片");
    error.statusCode = 422;
    throw error;
  }

  // 更新資料庫
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("沒有找到該篇文章");
      error.statusCode = 404;
      throw error;
    }
    // 檢查當前使用者是否為本文章的創建者
    if (post.creator.toString() !== req.userId) {
      const error = new Error("非文章本人，無法更新");
      error.statusCode = 403;
      throw error;
    }
    // 如果這次傳進來的路徑跟舊的不相符，就將本地舊的圖片檔案刪除
    if (imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl);
    }
    post.title = title;
    post.imageUrl = imageUrl;
    post.content = content;
    await post.save();
    res.status(200).json({ message: "文章已更新！", post: post });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// DELETE 刪除文章
exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("沒有找到該篇文章");
      error.statusCode = 404;
      throw error;
    }
    // 檢查當前使用者是否為本文章的創建者
    if (post.creator.toString() !== req.userId) {
      const error = new Error("非文章本人，無法刪除");
      error.statusCode = 403;
      throw error;
    }
    clearImage(post.imageUrl);
    await Post.findByIdAndRemove(postId);
    const user = await User.findById(req.userId);
    user.posts.pull(postId);
    await user.save();
    res.status(200).json({ message: "文章已刪除！" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// 刪除本地圖片方法
const clearImage = filePath => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, err => console.log(err));
};
