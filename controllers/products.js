import products from '../models/products.js'
import { StatusCodes } from 'http-status-codes'
import validator from 'validator'

export const create = async (req, res) => {
  try {
    console.log(req.files)
    req.body.image = req.files.map(f => f.path)

    const result = await products.create(req.body)
    res.status(200).json({
      success: true,
      message: '',
      result
    })
  } catch (error) {
    console.log(error)
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '未知錯誤 c-p'
      })
    }
  }
}

export const getAll = async (req, res) => {
  try {
    const sortBy = req.query.sortBy || 'name'
    const sortOrder = parseInt(req.query.sortOrder) || -1
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 20
    const page = parseInt(req.query.page) || 1
    const regexp = new RegExp(req.query.search || '', 'i')
    const data = await products
      .find({
        $or: [
          { name: regexp },
          { description: regexp }
        ]
      })
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage === -1 ? undefined : itemsPerPage)

    const total = await products.estimatedDocumentCount()
    res.status(200).json({
      success: true,
      message: '',
      result: {
        data, total
      }
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: '未知錯誤 c-p.all'
    })
  }
}

export const get = async (req, res) => {
  try {
    const sortBy = req.query.sortBy || 'name'
    const sortOrder = parseInt(req.query.sortOrder) || -1
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 20
    const page = parseInt(req.query.page) || 1
    const regexp = new RegExp(req.query.search || '', 'i')
    const data = await products
      .find({
        sell: true,
        $or: [
          { name: regexp },
          { description: regexp }
        ]
      })
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage === -1 ? undefined : itemsPerPage)

    const total = await products.countDocuments({ sell: true })
    res.status(200).json({
      success: true,
      message: '',
      result: {
        data, total
      }
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: '未知錯誤 c-p.get'
    })
  }
}

export const getId = async (req, res) => {
  try {
    // 如果 ID 不符合格式 拋出錯誤信息 ID
    if (!validator.isMongoId(req.params.id)) throw new Error('ID')

    const result = await products.findById(req.params.id)

    if (!result) throw new Error('NOT FOUND')

    res.status(200).json({
      success: true,
      message: '',
      result
    })
  } catch (error) {
    console.log(error)
    if (error.name === 'CastError' || error.message === 'ID') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'ID 格式錯誤 c-p.id'
      })
    } else if (error.message === 'NOT FOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '查無商品 c-p.id'
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '未知錯誤 c-p.id'
      })
    }
  }
}

export const edit = async (req, res) => {
  try {
    // 可能會有人用奇怪的 ID 所以要擋一下
    if (!validator.isMongoId(req.params.id)) throw new Error('ID')

    // 如果更新給他的是 undefine moogo 會去擋，他就不會更新
    req.body.image = req.file?.path

    await products.findByIdAndUpdate(req.params.id, req.body, { renValidators: true }).orFail(new Error('NOT FOUND'))
    res.status(200).json({
      success: true,
      message: ''
    })
  } catch (error) {
    console.log(error)
    if (error.name === 'CastError' || error.message === 'ID') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'ID 格式錯誤 c-p.e'
      })
    } else if (error.message === 'NOT FOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '查無商品 c-p.e'
      })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '未知錯誤 c-p.e'
      })
    }
  }
}
