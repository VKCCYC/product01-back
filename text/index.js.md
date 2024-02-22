引入並設置 dotenv，用於讀取環境變數。
import 'dotenv/config'

引入 Express、Mongoose 和 cors。

創建 Express 應用程式實例。
import express from 'express'

連接到 MongoDB 數據庫。
import mongoose from 'mongoose'

cors() 是一個用於處理跨域請求的中間件。
跨域請求是指由一個網頁的執行腳本發起，向另一個網域的不同源（Origin）發送 HTTP 請求。瀏覽器通常會限制這類請求，以保護使用者的安全性。
使用 cors() 中間件可以解決這個問題，它允許來自其他網域的請求能夠訪問你的伺服器資源，從而啟用跨域通信。
import cors from 'cors'

引入處理使用者相關路由的模組（在這個例子中是 routeUsers）。
import routeUsers from './routes/users.js'

設定應用程式使用中間件，包括處理 JSON 請求主體和啟用跨域請求。
express,cors

<!-- --------------------------------------------------------------- -->
// 創建 Express 應用程式實例
const app = express()

// 使用 Express 內建的中間件，用於處理傳入的請求主體（Request Body）中的 JSON 格式數據。
app.use(express.json())

// 自訂中間件：
app.use((_, req, res, next) => {
  // 這個中間件處理所有請求。
  // 在這個例子中，它會回應所有請求，並使用 400 Bad Request 狀態回傳一個 JSON 響應。
  res.status(StatusCodes.BAD_REQUEST).json({
    success: false,
    message: '資料格式錯誤'
  })
})


app.use((_, req, res, next))
這是一個自訂的 Express 中間件函數。在 Express 中，中間件是一種處理 HTTP 請求的函數，它可以修改請求或響應對象，或者終止請求-響應週期。這裡的 app.use((_, req, res, next) => {...}) 意味著這個中間件將應用到所有的請求。

讓我們分解這個中間件的參數：

_: 這通常是一個表示不使用的參數。在這裡，它被用作占位符，表示這個參數不會被使用。

req: 代表 HTTP 請求對象，包含有關客戶端發送的請求的信息。

res: 代表 HTTP 響應對象，可以通過它發送響應給客戶端。

next: 是一個回調函數，用於將控制權移交給堆疊中的下一個中間件。如果中間件函數不呼叫 next()，控制權可能永遠不會移交，或者在某些情況下將停止處理。

這個特定的中間件在所有請求上都執行，並使用 400 Bad Request 狀態回傳一個 JSON 響應，其中包含錯誤訊息 '資料格式錯誤'。這樣的中間件可能被用於處理特定類型的錯誤，或者進行全局的錯誤處理。


app.use(cors({
  // origin 請求的來源
  // callback (錯誤, 是否允許)
  origin (origin, callback) {
    if (origin === undefined || origin.includes('github') || origin.includes('localhost')) callback(null, true)
    else callback(new Error('CORS'), false)
  }
}))

這個 cors 中間件的配置包含一個 origin 函數，該函數用於判斷是否允許特定來源的跨域請求。具體來說：

origin(origin, callback): 這是一個函數，它接收請求的來源 origin 和一個回調函數 callback。

如果 origin 是 undefined（例如同一域內的請求），或者來源包含 'github' 或 'localhost'，則通過呼叫 callback(null, true) 允許跨域請求。

否則，通過呼叫 callback(new Error('CORS'), false) 拒絕跨域請求，同時回傳一個錯誤訊息 'CORS'。

這樣的配置允許來自 undefined（同一域）、'github' 或 'localhost' 的跨域請求，而其他來源的請求將被拒絕。這是一種限制跨域請求的方式，以提高應用程式的安全性。



Origin 是一個由瀏覽器自動添加到 HTTP 請求中的標頭，而不是 JavaScript 語法。當瀏覽器發送跨域請求時，會自動在 HTTP 請求的標頭中加入 Origin 標頭，指示請求的來源。

在 cors 中間件的配置中，origin 是一個由 Express 提供的函數，用於判斷是否允許特定來源的跨域請求。這個函數的第一個參數是由瀏覽器提供的 Origin 標頭的值。這是一個由瀏覽器自動處理的標頭，而不是由 JavaScript 語法直接設定的。