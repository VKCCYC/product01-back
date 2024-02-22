import { Router } from 'express'
import { create, login, logout, extend, getProfile, editCart, getCart } from '../controllers/users.js'
import * as auth from '../middlewares/auth.js'

const router = Router()
// create 是引入的 我們自己定義的
router.post('/', create)
router.post('/login', auth.login, login)
router.delete('/logout', auth.jwt, logout)
router.patch('/extend', auth.jwt, extend)
// '/me' 取自己資料
router.get('/me', auth.jwt, getProfile)

router.patch('/cart', auth.jwt, editCart)
router.get('/cart', auth.jwt, getCart)

/*
router.post('/login', auth.login, login): 当收到 POST 请求到 '/login' 路径时，先执行 auth.login 中间件，然后再执行 login 处理函数。这个路由似乎是用于处理用户登录的请求。
router.delete('/logout', auth.jwt, logout): 当收到 DELETE 请求到 '/logout' 路径时，先执行 auth.jwt 中间件，然后再执行 logout 处理函数。这个路由可能用于处理用户登出的请求，其中 auth.jwt 用于验证用户的身份（可能是通过 JSON Web Token，JWT）。
router.patch('/extend', auth.jwt, extend): 当收到 PATCH 请求到 '/extend' 路径时，先执行 auth.jwt 中间件，然后再执行 extend 处理函数。这个路由可能用于延长用户的身份验证，其中 auth.jwt 用于验证用户的身份。
router.get('/me', auth.jet, getProfile): 当收到 GET 请求到 '/me' 路径时，先执行 auth.jet 中间件，然后再执行 getProfile 处理函数。路由的注释中提到了 "取自己資料"，因此可能是用于获取当前登录用户的个人资料。
*/

/*
POST: 用于向指定资源提交数据，请求服务器进行处理。通常用于创建新资源，也可以用于更新现有资源。在路由中，通常用于处理表单提交、用户登录等操作。
DELETE: 请求服务器删除指定的资源。通常用于删除不再需要的资源。在路由中，可以用于处理用户注销、删除记录等操作。
PATCH: 对资源进行局部更新，请求服务器对资源进行部分修改。通常用于更新资源的一部分内容，而不是整体替换。在路由中，可以用于实现资源的部分更新。
GET: 请求服务器获取指定资源的数据。通常用于读取资源的信息，不会对资源产生副作用。在路由中，可以用于获取用户信息、展示页面等。
*/

export default router
