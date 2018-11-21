const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // 從請求內的header抓取token
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("未取得驗證資訊");
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(" ")[1];

  // 解碼
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "justsecret");
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }

  if (!decodedToken) {
    const error = new Error("未通過驗證");
    error.statusCode = 401;
    throw error;
  }

  // 驗證通過，將從token解出來的userId儲存到req內，讓其它路由也可使用
  req.userId = decodedToken.userId;
  next();
};
