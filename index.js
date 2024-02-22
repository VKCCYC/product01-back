import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import routeUsers from './routes/users.js'
import routeProducts from './routes/products.js'
import routeOrders from './routes/orders.js'
import { StatusCodes } from 'http-status-codes'
import mongoSanitize from 'express-mongo-sanitize'
import './passport/passport.js'

const app = express()

app.use(mongoSanitize())

// 設定這個前端才能取後端資料
app.use(cors({
  // origin 請求的來源
  // callback (錯誤, 是否允許)
  origin (origin, callback) {
    if (origin === undefined || origin.includes('github') || origin.includes('localhost')) callback(null, true)
    else callback(new Error('CORS'), false)
  }
}))

app.use((_, req, res, next) => {
  res.status(StatusCodes.FORBIDDEN).json({
    success: false,
    message: '請求被拒絕'
  })
})

app.use(express.json())
app.use((_, req, res, next) => {
  res.status(StatusCodes.BAD_REQUEST).json({
    success: false,
    message: '資料格式錯誤'
  })
})

app.use('/users', routeUsers)
app.use('/products', routeProducts)
app.use('/orders', routeOrders)

// all = get, post, ... 全部
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: '找不到 '
  })
})

app.listen(process.env.PORT || 4000, async () => {
  console.log('伺服器啟動')
  await mongoose.connect(process.env.DB_URL)
  mongoose.set('sanitizeFilter', true)
  console.log('資料庫連線成功')
})
