import passport from 'passport'
import { StatusCodes } from 'http-status-codes'

export const login = (req, res, next) => {

    passport.authenticate('login', { session: false }, (error, user, info) => { ... })： 這一行使用 Passport 的 authenticate 方法，使用名為 'login' 的策略來進行身份驗證。第二個參數 { session: false } 表示不使用 session，第三個參數是一個回調函數，用於處理身份驗證的結果。

  passport.authenticate('login', { session: false }, (error, user, info) => {
    (error, user, info) => { ... }： 這是身份驗證策略的回調函數。它接收三個參數：

    error: 表示在身份驗證過程中發生的錯誤。
    user: 表示成功驗證的使用者。
    info: 包含關於身份驗證的其他資訊，例如錯誤訊息。
    
    if (!user || error) { ... }： 如果身份驗證失敗或者發生錯誤，這個條件成立。在這裡，根據錯誤的類型或信息，返回相應的 HTTP 響應。
    
    if (!user || error) {
      
      if (info.message === 'Missing credentials') {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: '欄位錯誤'
        })
        return
      } else if (info.message === '未知錯誤') {
        res.status(500).json({
          success: false,
          message: '未知錯誤'
        })
        return
      } else {
        res.status(StatusCodes.UNAUTHORIZED).json({

          如果身份驗證失敗，返回 401 Unauthorized 響應，並包含錯誤訊息。

          success: false,
          message: info.message
        })
        return
      }
    }

    req.user = user： 如果身份驗證成功，將驗證通過的使用者物件賦值給 req.user。
    這樣，後續的中間件或路由處理可以使用 req.user 來訪問登入的使用者。

    req.user = user

    next()： 調用 next 函數，表示身份驗證通過，將控制權傳遞給下一個中間件或路由處理。
    next()
  })(req, res, next)
}


success: false  ???
在這個程式碼中，success: false 是用來指示身份驗證操作的結果的一個屬性。通常在身份驗證失敗的情況下，success 被設置為 false，這種方式能夠讓客戶端（例如瀏覽器或移動應用程式）更容易地處理身份驗證錯誤的情境。

當 success 被設置為 false 時，通常還會包含一個 message 屬性，該屬性包含了有關失敗的詳細信息。在這個程式碼中，message 的值是根據身份驗證失敗的原因而設置的，例如 '欄位錯誤'、'未知錯誤' 或者身份驗證過程中產生的其他錯誤訊息。

這種方式的好處是，當客戶端接收到身份驗證的回應時，它可以通過檢查 success 的值來判斷操作的成功與否，而 message 則可以提供更具體的信息，以便更好地處理和呈現錯誤給最終使用者。

<!-- --------------------------------------------------------------------------------------------------------------------------------------------------- -->

<!-- 这段代码定义了一个名为 jwt 的中间件函数，该中间件使用 Passport 中的 JWT 策略进行身份验证。下面是代码的中文解释： -->
export const jwt = (req, res, next) => {

  <!-- 
  passport.authenticate('jwt', { session: false }, (error, data, info) => { ... })(req, res, next): 
  这一行调用 Passport 中的 authenticate 函数，并使用 JWT 策略进行身份验证。
  { session: false } 表示不使用 session，而是基于 token 进行身份验证。
  回调函数接收三个参数：error（错误信息）、data（身份验证成功后的数据）、info（其他信息）。 
  -->
  passport.authenticate('jwt', { session: false }, (error, data, info) => {
    // 如果有錯誤或是沒有資料的話

    if (error || !data) {
      if (info instanceof jsonwebtoken.JsonWebTokenError) {
        // JWT 格式不對、SECRET 不對
        res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: 'JWT 無效M.A'
        })
      } else if (info.message === '未知錯誤') {
        res.status(500).json({
          success: false,
          message: '未知錯誤'
        })
      } else {
        // 其他錯誤
        res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: info.message
        })
      }
      return
    }
    req.user = data.user
    req.token = data.token
  })(req, res, next)
}

如果发生错误 (error 存在或者 data 不存在)，则根据不同的错误类型返回相应的 JSON 响应：

如果 info 是 jsonwebtoken.JsonWebTokenError 类型，表示 JWT 的格式不正确或者密钥不匹配，返回 401 UNAUTHORIZED 状态码和相应的 JSON 响应。

如果 info.message 是 '未知錯誤'，返回 500 INTERNAL SERVER ERROR 状态码和相应的 JSON 响应。

对于其他错误，返回 401 UNAUTHORIZED 状态码和相应的 JSON 响应。

如果身份验证成功 (data 存在)，将用户对象和 token 存储在请求对象中，分别为 req.user 和 req.token。

该中间件的主要作用是在请求中验证 JWT，如果验证失败，返回相应的错误信息；如果验证成功，将用户对象和 token 存储在请求对象中，以便后续的路由处理中可以使用。

