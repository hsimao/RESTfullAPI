const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");

const app = express();

// 設置檔案儲存位置
const fileStorage = multer.diskStorage({
  // 儲存位置
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  // 儲存的圖片名稱
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  }
});

// 設定檢查檔案副檔名
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));

// 開放掛站請求設置, 放置在要開放請求的路由上方
app.use((req, res, next) => {
  // 設置要開放的網域. 米字好“*”全部開放，或可設置多個網域"https://s.codepen.io, htts://hsimao.com"
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  // 設置要開放的方法
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

// 錯誤處理
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

// 獲取資料庫URI
require("dotenv").config({ path: "variables.env" });
// 連結mongoDB
mongoose
  .connect(
    process.env.MONGO_URI,
    {
      useNewUrlParser: true,
      useCreateIndex: true
    }
  )
  .then(result => {
    app.listen(8080, () => {
      console.log("DB is connect!, 8080 port is start!");
    });
  })
  .catch(err => console.log(err));
