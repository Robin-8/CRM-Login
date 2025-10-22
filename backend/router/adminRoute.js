const express = require('express')
const {createAdmin, adminLogin, adminUpdating ,adminGetAllUsers,adminGetUserById, adminSoftDeleteUser, updateUser} = require('../controllers/adminController')
const router = express.Router()



router.post('/adminRegister',createAdmin)
router.post('/adminLogin',adminLogin)
router.put('/adminUpdating',adminUpdating)
router.get('/adminAllUsers',adminGetAllUsers)
router.get('/adminByID',adminGetUserById)
router.patch('/delete/:id',adminSoftDeleteUser)
router.patch('/updating/:id',updateUser)


module.exports = router