import { Schema, model } from 'mongoose'

const schema = new Schema({
  name: {
    type: String,
    required: [true, '缺少師傅姓名']
  },
  price: {
    type: Number,
    required: [true, '缺少時段價格']
  },
  image: {
    type: [String],
    required: [true, '缺少師傅圖片']
  },
  description: {
    type: String,
    required: [true, '缺少師傅說明']
  },
  category: {
    type: String,
    required: [true, '缺少類別分類'],
    enum: {
      values: ['生理男', '生理女', '全部'],
      message: '商品分類錯誤'
    }
  },
  sell: {
    type: Boolean,
    required: [true, '缺少商品上架狀態']
  }
}, {
  timeseries: true,
  versionKey: false
})

export default model('products', schema)
