import { Schema, model, ObjectId } from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'
import UserRole from '../enums/UserRole.js'

// 購物車
const cartSchema = new Schema({
  product: {
    type: ObjectId,
    ref: 'products',
    required: [true, '缺少商品欄位']
  },
  quantity: {
    type: Number,
    required: [true, '缺少商品數量']
  }
}, {
  // 補欄位設定
  // 不要存被改了幾次
  versionKey: false
})

const schema = new Schema({
  // 帳號
  account: {
    // 資料型態 文字
    type: String,
    // 必填
    required: [true, '缺少使用者帳號'],
    // 帳號長短
    minlength: [4, '帳號長度太短'],
    maxlength: [20, '帳號長度太長'],
    // 不能重複
    unique: true,
    validate: {
      validator (value) {
        // validator.isAlphanumeric 是一個用於檢查字符串是否只包含字母和數字的函數。
        return validator.isAlphanumeric(value)
      },
      message: '帳號格式錯誤'
    }
  },
  // 信箱
  email: {
    type: String,
    required: [true, '缺少使用者信箱'],
    unique: true,
    validate: {
      validator (value) {
        return validator.isEmail(value)
      },
      message: '信箱格式錯誤'
    }
  },
  // 密碼
  password: {
    type: String,
    required: [true, '缺少使用者密碼']
  },
  tokens: {
    type: [String]
  },
  cart: {
    type: [cartSchema]
  },
  role: {
    type: Number,
    default: UserRole.USER
  }
}, {
  // 補欄位設定
  // 資料的建立日期跟更新日期
  timestamps: true,
  // 不要存被改了幾次
  versionKey: false
})

// mongo 的虛擬欄位 .virtual('名稱')
schema.virtual('cartQuantity')
// 虛擬欄位當我取值跟改值的時候該怎麼對原始資料取值跟改值
  .get(function () {
    return this.cart.reduce((total, current) => {
      return total + current.quantity
    }, 0)
  })

schema.pre('save', function (next) {
  const user = this
  // 如果我的 user 有修改到密碼欄位的話
  if (user.isModified('password')) {
    // 如果密碼長度小於 4 或者是 > 20
    if (user.password.length < 4 || user.password.length > 20) {
      const error = new Error.ValidatorError({ message: '密碼長度不對' })
      next(error)
    } else {
      user.password = bcrypt.hashSync(user.password, 10)
    }
  }
  next()
})

export default model('users', schema)
