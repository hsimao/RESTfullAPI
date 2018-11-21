# 後端 RESTfull API

## 使用語言

1. nodejs
2. mongoDB

## 路由 API 文檔

</br>

### 1、註冊

#### URL:

```
http://localhost:8080/auth/signup
```

#### 請求方式:

```
PUT
```

#### 參數類型

| 参数     | 必填 | 類型   | 說明            |
| :------- | :--: | :----- | :-------------- |
| email    |  Y   | string | 須符合信箱格式  |
| password |  Y   | string | 不可少於 5 字元 |
| name     |  Y   | string |                 |

#### return 示例：

```javascript
{
  message: "新用戶註冊成功",
  userId: "5bf5202a2aa7f704f28e99ca"
}
```

</br>

### 2、登入

#### URL:

```
http://localhost:8080/auth/login
```

#### 請求方式:

```
POST
```

#### 參數類型

| 参数     | 必填 | 類型   | 說明            |
| :------- | :--: | :----- | :-------------- |
| email    |  Y   | string | 須符合信箱格式  |
| password |  Y   | string | 不可少於 5 字元 |

#### return 示例：

```javascript
{
  token: "token...",
  userId: "5bf5202a2aa7f704f28e99ca"
}
```

</br>

### 3、取得所有文章(含分頁控制)

#### URL:

```
http://localhost:8080/feed/posts?page=" + page
```

#### 請求方式:

```
GET
```

#### 參數類型

| 参数  | 必填 | 類型   | 說明                       |
| :---- | :--: | :----- | :------------------------- |
| page  |  n   | url    | 分頁頁數，未輸入將預設為 1 |
| token |  Y   | string | 使用 headers 傳遞          |

#### 請求範例:

```javascript
fetch("http://localhost:8080/feed/posts?page=1", {
  headers: {
    Authorization: "Bearer " + token
  }
});
```

#### return 示例：

```javascript
{
  message: "成功取得文章資料.",
  posts: posts,
  totalItems: totalItems
}
```

</br>

### 4、取得單一文章

#### URL:

```
http://localhost:8080/feed/post/" + postId
```

#### 請求方式:

```
GET
```

#### 參數類型

| 参数   | 必填 | 類型   | 說明                  |
| :----- | :--: | :----- | :-------------------- |
| postId |  Y   | url    | 文章 id,透過 url 傳遞 |
| token  |  Y   | string | 使用 headers 傳遞     |

#### 請求範例:

```javascript
fetch("http://localhost:8080/feed/post/5bf536bce1e0800e978798da", {
  headers: {
    Authorization: "Bearer " + token
  }
});
```

#### return 示例：

```javascript
{
  message: "已取得文章資料",
  post: post
}
```

</br>

### 5、新增文章

#### URL:

```
http://localhost:8080/feed/post
```

#### 請求方式:

```
POST
```

#### 參數類型

| 参数    | 必填 | 類型     | 說明                                       |
| :------ | :--: | :------- | :----------------------------------------- |
| title   |  Y   | string   |                                            |
| content |  Y   | string   |                                            |
| image   |  Y   | formData | 因為有圖片檔案，建議統一使用 formData 傳遞 |

#### 請求範例:

```javascript
fetch(url, {
  method: "POST",
  body: formData,
  headers: {
    Authorization: "Bearer " + token
  }
});
```

#### return 示例：

```javascript
{
  message: "文章創建成功!",
  post: post,
  creator: {
    _id: creator._id,
    name: creator.name
  }
}
```

</br>

### 6、更新文章

#### URL:

```
http://localhost:8080/feed/post/ + postId
```

#### 請求方式:

```
PUT
```

#### 參數類型

| 参数    | 必填 | 類型     | 說明                                       |
| :------ | :--: | :------- | :----------------------------------------- |
| title   |  Y   | string   |                                            |
| content |  Y   | string   |                                            |
| image   |  N   | formData | 因為有圖片檔案，建議統一使用 formData 傳遞 |
| postId  |  Y   | url      | 文章 id,透過 url 傳遞                      |

#### 請求範例:

```javascript
fetch("http://localhost:8080/feed/post/5bf536bce1e0800e978798da", {
  method: "PUT",
  body: formData,
  headers: {
    Authorization: "Bearer " + token
  }
});
```

#### return 示例：

```javascript
{
  message: "文章已更新！",
  post: result
}
```

</br>

### 7、刪除文章

#### URL:

```
http://localhost:8080/feed/post/ + postId
```

#### 請求方式:

```
DELETE
```

#### 參數類型

| 参数   | 必填 | 類型   | 說明                  |
| :----- | :--: | :----- | :-------------------- |
| postId |  Y   | url    | 文章 id,透過 url 傳遞 |
| token  |  Y   | string | 使用 headers 傳遞     |

#### 請求範例:

```javascript
fetch("http://localhost:8080/feed/post/5bf536bce1e0800e978798da", {
  method: "DELETE",
  headers: {
    Authorization: "Bearer " + this.props.token
  }
});
```

#### return 示例：

```javascript
{
  message: "文章已刪除！";
}
```
