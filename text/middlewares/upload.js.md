import multer from 'multer'

import multer from 'multer'：這是使用ES6模組語法導入multer套件。
這意味著你的專案可能是使用ECMAScript 6（或更新版本）的模組系統。

multer：這是Node.js的一個套件，用於處理文件上傳。
它能夠解析multipart/form-data類型的表單數據，並將文件上傳保存到指定的目錄中。

這段程式碼的背後可能會有更多的設定，例如設定上傳文件的目錄、檔案名稱的生成方式、上傳限制等，取決於實際應用的需求。
如果你想了解更多有關multer的詳細設定和用法，建議查閱官方文檔或相關資源。

import { v2 as cloudinary } from 'cloudinary'
import { v2 as cloudinary } from 'cloudinary'：
這行程式碼使用ES6模組語法從cloudinary套件中導入Cloudinary的版本2（v2）。
Cloudinary是一個雲端服務，提供用於管理和儲存圖片和多媒體文件的解決方案。

import { CloudinaryStorage } from 'multer-storage-clodinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'：
這行程式碼導入了multer-storage-cloudinary模組中的CloudinaryStorage。
這是multer套件的一個擴充，允許將上傳的文件直接存儲到Cloudinary中，而不是本地伺服器。

這段程式碼的目的是配置multer和Cloudinary一起使用，以便將上傳的文件直接存儲到Cloudinary服務中。這種配置通常需要進一步的設定，例如Cloudinary的帳戶憑證、上傳的預設設定、處理上傳後的回應等，這些細節可能在後續的程式碼中進行配置。

<!-- ----------------------------------------------------------------------------------------------------------------------------------------------- -->
這段程式碼的目的是配置 multer 和 Cloudinary 來處理文件上傳。

cloudinary.config：這部分設定了 Cloudinary 的帳戶資訊，
包括 cloud_name（雲端名稱）、
api_key（API 金鑰）和 api_secret（API 密鑰）。
這些資訊是用來驗證和訪問 Cloudinary 服務的。
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})

const upload = multer({ ... })：這裡使用 multer 創建了一個上傳實例 upload。
multer 是一個 Node.js 中用來處理文件上傳的中間件。
const upload = multer({

  storage: new CloudinaryStorage({ cloudinary })：這裡配置了 multer 使用 Cloudinary 作為文件存儲的地方。
  CloudinaryStorage 是 multer-storage-cloudinary 套件提供的一個類，用於將上傳的文件直接存儲到 Cloudinary。
  storage: new CloudinaryStorage({ cloudinary }),

  fileFilter 函數：這是 multer 中的一個過濾器函數，
  用來檢查上傳的文件類型。在這裡，
  如果文件的 MIME 類型是 'image/jpeg' 或 'image/png'，
  則認為是合法的文件，否則認為是不合法的文件。
  <!-- 
  1. req：這是代表 HTTP 請求的物件，即客戶端發送到伺服器的請求。
     這裡的 req 包含了有關請求的資訊，例如請求標頭、參數、身份驗證資訊等。
  2. file：這是代表上傳的文件的物件。file 物件包含了有關上傳文件的相關資訊，
     例如文件的原始名稱、文件的 MIME 類型、文件的大小等。
  3. callback：這是一個回呼函數，用於通知 multer 是否接受或拒絕上傳的文件。
     它具有兩個參數，第一個是錯誤（如果有的話），第二個是一個布林值，表示是否接受該文件。
   -->
  fileFilter (req, file, callback) {
    if (['image/jpeg', 'image/png'].includes(file.mimetype)) {

      <!-- 
      null（或 undefined）：表示沒有錯誤。這個參數用於通知 multer 函數執行成功，文件被接受。
      true 或 false：表示是否接受文件。如果為 true，則表示接受文件；如果為 false，則表示拒絕文件。
       -->
      callback(null, true)
    } else {

      <!-- 
      在 fileFilter 函數中，通常透過檢查 file 物件的屬性來判斷是否接受該文件。
      如果檢查通過，則使用 callback(null, true) 通知 multer 接受該文件；
      如果檢查不通過，則使用 callback(new multer.MulterError('LIMIT_FIELD_FORMAT'), false) 
      通知 multer 拒絕該文件。這裡的錯誤代碼 'LIMIT_FIELD_FORMAT' 是一個自定義的錯誤碼，
      用於表示文件格式不符合要求的錯誤。
      -->
      callback(new multer.MulterError('LIMIT_FIELD_FORMAT'), false)
    }
  },

  limits：這裡設定了上傳文件的大小限制，文件大小不能超過 1MB。
  limits: {
    // 1MB 大小
    fileSize: 1024 * 1024
  }
})

<!-- ---------------------------------------------------------------------------------------------------------------------------- -->
这段代码是一个 Node.js 中的 Express 中间件函数，它用于处理文件上传。
export default (req, res, next) => {

  // 使用 upload.single('image') 中间件处理上传的单个文件，'image' 是表单字段的名称
  upload.single('image')(req, res, error => {

     // 如果上传过程中出现了 multer 错误
    if (error instanceof multer.MulterError) {

      / 默认错误信息为 '上传错误'
      let message = '上傳錯誤'

      // 根据错误代码设置更具体的错误信息
      if (error.code === 'LIMIT_FILE_SIZE') {

        // 如果文件超过了限制大小，则设置错误信息为 '文件太大'
        message = '檔案太大'

      } else if (error.code === 'LIMIT_FILE_FORMAT') {

        // 如果文件格式不符合要求，则设置错误信息为 '文件格式错误'
        message = '檔案格式錯誤'
      }

       // 返回错误响应
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message
      })
    }
  })
}

