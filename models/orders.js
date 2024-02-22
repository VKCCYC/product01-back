import { Schema, model, ObjectId } from 'mongoose'

const cartSchema = new Schema({
  product: {
    type: ObjectId,
    ref: 'products',
    required: [true, '缺少師傅欄位o']
  },
  quantity: {
    type: Number,
    required: [true, '缺少師傅時數o']
  }
})

const schema = new Schema({
  user: {
    type: ObjectId,
    ref: 'users',
    required: [true, '缺少使用者o']
  },
  // data: {
  //   type: Date,
  //   default: Date.now
  // },
  cart: {
    type: [cartSchema],
    validate: {
      validator (value) {
        return Array.isArray(value) && value.length > 0
      },
      message: '再次確認不能為空'
    }
  }
}, { versionKey: false, timestamps: true })

export default model('orders', schema)
