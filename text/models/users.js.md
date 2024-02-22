import { Schema, model } from "mongoose"
import validator from "validator"
import bcrypt from "bcrypt"

const schema = new Schema({

})

export default model('users', schema)

這段程式碼是使用Node.js的一個套件，名為mongoose，來定義和建立一個MongoDB中的集合（collection）的資料模型（data model）。這是一個用於建立和管理MongoDB資料庫的JavaScript庫。

具體而言，這段程式碼的目的是定義一個名為users的資料模型，它將在MongoDB中創建一個名為"users"的集合，並且可以用於操作和儲存使用者（user）相關的資料。這個模型還未被完全定義，因為Schema中的內容目前是空的。

這裡使用了validator套件，它通常用於驗證數據的合法性。同時，還使用了bcrypt套件，這是一個用於密碼加密和比對的庫，通常在處理使用者密碼時使用。

總體而言，這段程式碼的目的是建立一個MongoDB的資料模型，並將它封裝成一個名為users的集合，以便在應用程式中進行使用者相關的資料存儲和操作。

<!-- --------------------------------------------------------------------------------------------------------------------- -->

 validate: {
      validator (value) {
        return validator.isAlphanumeric(value)
      },
      message: '帳號格式錯誤'
    }

這段程式碼是一個資料驗證（data validation）的部分，看起來是使用在 JavaScript 的某個對象或類別中，可能是在某個資料模型的定義中，例如 MongoDB 的 Mongoose 模型或其他類似的資料庫模型。

這段程式碼的作用是檢查一個特定的資料欄位（可能是帳號）的值是否符合 validator.isAlphanumeric 函數的條件。
在這裡，validator.isAlphanumeric 是一個用於檢查字符串是否只包含字母和數字的函數。如果資料欄位的值不符合這個條件，則會返回一個自定義的錯誤訊息："帳號格式錯誤"。

tokens: {
    type: [String]
  },
  cart: {

  },
  role: {
    type: Number,
    // 0 = 會員
    // 1 = 管理員
    default: 0
  }

tokens: 這是一個字串（String）陣列，可能被用來存儲某種驗證或身份識別的令牌。

cart: 這是一個空的物件，可能是用來存儲購物車相關的資訊。然而，這部分的定義是空的，可能在程式碼的其他部分進行了具體的定義。

role: 這是一個數字（Number）型態的屬性，表示使用者的角色。預設值是0，通常被定義為會員角色。如果是1，可能被定義為管理員角色。這是一個簡單的角色系統，其中不同的數字代表不同的角色。

這些定義的確切用途和上下文可能會取決於你的應用程式的需求，以及在程式碼中的其他部分是如何使用這些模型定義的。

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
})

這段程式碼定義了一個名為 cartSchema 的 Mongoose schema，這可能是用來描述購物車中單個商品的資料結構。以下是對每個屬性的簡要解釋：

product: 這是一個使用了 ObjectId 型態的屬性，表示連接到其他模型（在這裡是 'products' 模型）。通常，這種型態的屬性用於建立與其他模型的關聯，這裡可能是與商品（products）模型的關聯。ref: 'products' 表示這個屬性參考了 'products' 模型，這樣可以在檢索購物車項目時，同時檢索相關的商品資訊。required: [true, '缺少商品欄位'] 表示這個屬性是必需的，如果缺少則會返回一個錯誤訊息。

quantity: 這是一個數字型態的屬性，表示購物車中該商品的數量。required: [true, '缺少商品數量'] 表示這個屬性也是必需的，如果缺少則會返回一個錯誤訊息。

總的來說，這個 cartSchema 定義了一個簡單的購物車項目結構，包含商品的參考（使用商品的 ObjectId）和商品的數量。當向購物車中添加商品時，可能會按照這個模式創建相應的文檔。

schema.pre('save', function (next) {
  const user = this
  // 如果我的 user 有修改到密碼欄位的話
  if (user.isModified('password')) {
    // 如果密碼長度小於 4 或者是 > 20
    if (user.password.length < 4 || user.password.length > 20) {
      const error = new Error.ValidatorError({ message: '密碼長度不對' })
      next(error)
    }
  }
})

schema.pre('save', function (next) { ... })：這表示在保存文檔之前（'save'）執行這段 middleware。next 是一個 callback 函數，它用於繼續執行保存過程。

const user = this：這裡的 this 指的是要保存的文檔，這裡是使用者（user）。

if (user.isModified('password')) { ... }：檢查使用者（user）的密碼是否被修改。如果密碼有修改，則執行以下操作。

if (user.password.length < 4 || user.password.length > 20) { ... }：檢查密碼的長度是否在指定範圍內。如果密碼的長度小於4或大於20，則執行以下操作。

const error = new Error.ValidatorError({ message: '密碼長度不對' })：創建一個新的 ValidatorError，並設置錯誤訊息為 "密碼長度不對"。

next(error)：將錯誤對象傳遞給 next，這樣它會被傳遞到保存操作的回調中，並中斷保存過程。

總的來說，這個 middleware 用於檢查在保存使用者文檔之前，是否滿足指定的密碼條件，如果不滿足，則中斷保存操作並返回一個密碼長度不正確的錯誤。


pre 是一個 middleware，用於在某個特定操作（例如保存文檔）執行前進行額外的處理。pre 函數允許你在執行主要操作之前執行一些自定義的邏輯。

在你的程式碼中，這個 middleware 是用來在保存（save）使用者（user）文檔前進行操作。具體來說，這段程式碼的邏輯是檢查使用者的密碼是否被修改，如果有修改且密碼不符合指定的長度條件，就會阻止保存操作，並返回一個錯誤。

else {
      user.password = bcrypt.hashSync(user.password, 10)
    }

這段程式碼是 schema.pre('save', ...) 中的 else 部分。換句話說，如果使用者的密碼沒有被修改或是密碼符合條件，就會執行下面的邏輯。

在這個 else 中，看起來是在使用 bcrypt 函式庫的 hashSync 方法對密碼進行哈希處理。這樣的做法通常用於將原始密碼轉換成一個雜湊（hash），以增加密碼的安全性。哈希處理通常是單向的，這意味著很難從雜湊值反向得到原始密碼。

具體來說：

bcrypt.hashSync(user.password, 10): 這裡使用 bcrypt 的 hashSync 方法，將使用者的密碼 user.password 進行哈希處理。10 是所謂的「鹽」（salt）的成本因子，它影響哈希的計算成本。成本因子越大，計算成本越高，通常用於提高哈希的安全性。

user.password = ...: 然後將哈希後的密碼重新賦值給使用者的密碼屬性，這樣在保存操作中，將哈希後的密碼保存到資料庫。

總的來說，這段程式碼確保了當密碼需要被保存時，它會經過哈希處理，提高了安全性。bcrypt 是一個常用的密碼哈希函式庫，用於存儲安全的密碼。

<!-- ---------------------------------------------------------------------------------------------------- -->

这段代码是使用JavaScript中的.get()方法，该方法通常用于获取对象属性的值。在这里，它似乎是用于计算购物车中所有商品的总数量。

.get(function () {
    this.cart: 假设this指向一个包含购物车商品的对象，.cart是该对象中的一个属性，表示购物车数组。
    reduce(): 这是一个数组方法，用于对数组的每个元素执行一个指定的函数，以便将数组减少为单个值。
    total和current: 这是reduce()函数中的两个参数，total用于累积计算结果，而current则代表数组中的当前元素。
    
    current.quantity: 假设购物车中的每个商品对象都有一个quantity属性，表示该商品的数量。
    return this.cart.reduce((total, current) => {

      => total + current.quantity: 这是一个箭头函数，用于将每个商品的数量累加到total中。     
      return total + current.quantity

      0: 是reduce()函数的初始值，表示累加的起始值为0。
    }, 0)
  })
  因此，整个代码段的目的是计算购物车中所有商品的数量总和。

  reduce() 是 JavaScript 中用于处理数组的一个方法，它可以把数组中的每个元素都经过一个指定的计算，最终得到一个单一的值。

  在这段代码中，reduce() 被用来计算购物车中所有商品的数量总和。购物车中的每个商品对象都有一个 quantity 属性，表示该商品的数量。通过 reduce()，对购物车中的每个商品执行一个计算，将每个商品的数量加到一个总数中，最终得到购物车中所有商品数量的总和。

