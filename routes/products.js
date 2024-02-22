import { Router } from 'express'
import * as auth from '../middlewares/auth.js'
import { create, getAll, edit, get, getId } from '../controllers/products.js'
import upload from '../middlewares/upload.js'
import admin from '../middlewares/admin.js'

const router = Router()

// 1. 先驗證有沒有權限
// 2. 再上傳
// 3. 再建立
router.post('/', auth.jwt, admin, upload, create)
router.get('/all', auth.jwt, admin, getAll)
router.patch('/:id', auth.jwt, admin, upload, edit)
router.get('/', get)
router.get('/:id', getId)

export default router
