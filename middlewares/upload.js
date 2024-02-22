import multer from 'multer'
// 雲端平台套件
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { StatusCodes } from 'http-status-codes'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})

const upload = multer({
  storage: new CloudinaryStorage({ cloudinary }),
  fileFilter (req, file, callback) {
    if (['image/jpeg', 'image/png'].includes(file.mimetype)) {
      callback(null, true)
    } else {
      callback(new multer.MulterError('LIMIT_FIELD_FORMAT'), false)
    }
  },
  limits: {
    // 1MB 大小
    fileSize: 1024 * 1024
  }
})

export default (req, res, next) => {
  upload.array('image', 3)(req, res, error => {
    if (error instanceof multer.MulterError) {
      console.log(error)
      let message = '上傳錯誤_m.u'
      if (error.code === 'LIMIT_FILE_SIZE') {
        message = '檔案太大_m.u'
      } else if (error.code === 'LIMIT_FILE_FORMAT') {
        message = '檔案格式錯誤_m.u'
      }
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message
      })
    } else if (error) {
      res.status(500).json({
        success: false,
        message: '未知錯誤_m.u'
      })
    } else next()
  })
}
