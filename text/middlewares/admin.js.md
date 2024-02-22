这段代码是一个 Express 中间件函数，用于验证用户是否具有管理员权限。
import UserRole from '../enums/UserRole.js'
import { StatusCodes } from 'http-status-codes'

// 导出一个中间件函数，接收 req、res、next 作为参数
export default (req, res, next) => {

  // 如果请求中的用户角色不是管理员
  if (req.user.role !== UserRole.ADMIN) {

    // 返回 HTTP 状态码 403（禁止访问），并发送 JSON 响应
    res.status(StatusCodes.FORBIDDEN).json({

      // 响应中的 success 字段为 false
      success: false,

      // 响应中的 message 字段为 '没有权限'
      message: '沒有權限'
    })
  } else {
    next()
  }
}



