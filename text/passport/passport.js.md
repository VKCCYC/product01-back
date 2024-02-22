import passport from 'passport'
import passportLocal from 'passport-local'
import passportJWT from 'passport-jwt'
import bcrypt from 'bcrypt'
import users from '../models/users.js'

import passport from 'passport'： 導入 Passport 模組，Passport 是一個 Node.js 的身份驗證中間件，用於處理使用者身份驗證和授權的相關功能。

import passportLocal from 'passport-local'： 導入 Passport 的本地策略（local strategy），本地策略通常用於使用者名稱和密碼的身份驗證。

import passportJWT from 'passport-jwt'： 導入 Passport 的 JSON Web Token（JWT）策略，JWT 策略通常用於通過 JWT 實現的令牌進行身份驗證。

import bcrypt from 'bcrypt'： 導入 bcrypt 模組，這是一個用於加密和比對密碼的函式庫，可能在身份驗證過程中用於加密和比對密碼。

import users from '../models/users.js'： 導入使用者（user）模型，這個模型可能定義了與使用者相關的資料模式和操作，這些資料通常儲存在資料庫中。

這個程式碼片段可能是用於設定 Passport，並配置一些身份驗證策略，以及使用者資料的來源（這裡是 users 模型）以進行身份驗證。具體的配置和策略設置可能在這段程式碼後續的部分中進行。例如，你可能會設置本地策略和 JWT 策略，定義使用者驗證的邏輯等等。



passport.use('local', new passportLocal.Strategy({
assport.use('local', ...)： 使用 passport.use 方法設定一個本地策略，並給予它一個名為 'local' 的標識符。

new passportLocal.Strategy({ usernameField: 'account', passwordField: 'password' }, async (account, password, done) => { ... })： 創建一個新的 Passport 本地策略。這裡指定了使用者名稱字段為 'account'，密碼字段為 'password'。

  usernameField: 'account',
  passwordField: 'password'

  async (account, password, done) => { ... }： 這是本地策略的回調函數，當進行身份驗證時會被呼叫。
}, async (account, password, done) => {
  try {

    // 尋找一個帳號
    const user = await users.findOne({ account })： 使用 await 和 users.findOne 方法尋找擁有特定帳號的使用者。
    這裡假設 users 是一個 Mongoose 模型，並且使用了 findOne 方法來尋找匹配的使用者。
    
    const user = await users.findOne({ account })

    if (!user) throw new Error('ACCOUNT')： 如果沒有找到使用者，則拋出一個帳號錯誤，表示找不到對應的帳號。
    if (!user) throw new Error('ACCOUNT')

    if (!bcrypt.compareSync(password, user.password)) throw new Error('PASSWORD')： 使用 bcrypt.compareSync 方法比對傳入的密碼和使用者模型中的密碼是否匹配。如果不匹配，則拋出一個密碼錯誤。
    if (!bcrypt.compareSync(password, user.password)) throw new Error('PASSWORD')

    return done(null, user, null)： 如果帳號和密碼驗證通過，則呼叫 done 回調，
    將 user 物件作為驗證的結果傳遞給 Passport。
    第一個參數為錯誤，這裡是 null 表示沒有錯誤，
    第二個參數是成功驗證的使用者物件，
    第三個參數可以用於傳遞額外的訊息，這裡是 null。
    return done(null, user, null)
  } catch (error) {
    console.log(error)
  }
}
))

<!-- -------------------------------------------------------------- -->


<!-- 这段代码是使用 Passport 和 Passport-JWT 策略来处理 JSON Web Token (JWT) 鉴权，并在鉴权过程中添加了一些自定义逻辑。 -->

<!-- 
passport.use('jwt', ...) - 使用 Passport 的JWT策略，其中'jwt'是策略的名称。
new passportJWT.Strategy({...}, async () => {...}) - 创建一个新的JWT策略 -->
passport.use('jwt', new passportJWT.Strategy({

  <!-- 
  jwtFromRequest: 从请求中提取JWT的方式，这里使用 passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()，表示JWT将从HTTP请求的授权头中提取，作为Bearer Token。 
  -->
  jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),

  <!-- 
  secretOrKey: JWT的密钥，这里使用 process.env.JWT_SECRET，表示密钥将从环境变量中获取。
  -->
  secretOrKey: process.env.JWT_SECRET,

  <!-- passReqToCallback: true - 这个选项设置为 true，允许将请求对象 (req) 传递给回调函数，这在后续的代码中用于获取请求的基本 URL。 -->
  passReqToCallback: true,

  // 略過過期檢查
  <!--
  ignoreExpiration: true - 这个选项设置为 true，表示忽略 JWT 的过期检查。
  -->
  ignoreExpiration: true

  <!-- 
  异步回调函数 - 这是 Passport-JWT 策略的回调函数，接收三个参数：req（请求对象）、payload（JWT 载荷）、done（回调函数）。
   -->
}, async (req, payload, done) => {
  try {
  // jwt 解意出來 過期的日期
    // jwt 過期時間單位是秒，node.js 日期單位是毫秒
    const expired = payload.exp * 1000 < new Date().getTime()

    <!-- 
    首先，代码计算了 JWT 的过期时间，并检查是否过期。如果过期并且请求的 URL 不是 '/users/extend' 或 '/user/logout'，则抛出一个 'EXPIRED' 错误。
     -->
    const url = req.baseUrl + req.path
    if (expired && url !== '/users/extend' && url !== '/user/logout') throw new Error('EXPIRED')

    // 取得 token 後 檢查是否有這帳號存在
    const token = passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()(req)

    <!-- 然后，获取请求中的 JWT，并检查是否存在对应的用户。 -->
    const user = await users.findOne({ _id: payload._id, tokens: token })

    <!-- 如果 JWT 无效或者对应的用户不存在，抛出 'JWT' 错误 -->
    if (!user) throw new Error('JWT')

    <!-- 最后，通过回调函数将结果返回给 Passport。如果有错误，返回相应的错误信息；否则，返回用户对象和 token。 -->
    return done(null, { user, token }, null)
  } catch (error) {
    console.log(error)
    if (error.message === 'EXPIRED' || error.message === 'JWT') return done(null, null, { messagge: 'JWT 無效' })
    else return done(null, null, { messagge: '未知錯誤' })
  }
}))

这段代码的主要目的是在 JWT 鉴权的基础上，加入了一些额外的逻辑，如过期检查、特定路径的略过检查等。如果 JWT 有效且用户存在，将用户对象和 token 返回给 Passport，否则返回相应的错误信息。


<!-- 
req.baseUrl: 表示请求的基本路径，即请求的路径中除了路由处理的部分之外的路径。
例如，如果请求的 URL 是 "/users/123/profile"，那么 req.baseUrl 将是 "/users/123"。 
-->
<!--
req.path: 表示请求的路径部分，即路由处理的部分。
对于上面的例子，req.path 将是 "/profile"。
所以，url 的值将是请求的完整路径，即 "/users/123/profile"。 
-->
const url = req.baseUrl + req.path

<!-- 
payload.exp: 是 JWT 的过期时间戳，表示在这个时间之前 JWT 是有效的。这个时间戳一般以秒为单位。
new Date().getTime(): 获取当前时间的毫秒数。
将 payload.exp 转换成毫秒并与当前时间比较，如果过期时间早于当前时间，那么 expired 将被设置为 true，表示 JWT 已经过期。 -->
const expired = payload.exp * 1000 < new Date().getTime()

这两行代码是用于获取请求的 URL 和检查 JWT 是否过期的逻辑。

获取当前请求的完整路径 (url)。
判断 JWT 是否过期 (expired)，如果过期，可能会触发后续的处理逻辑，比如抛出一个 'EXPIRED' 错误。


