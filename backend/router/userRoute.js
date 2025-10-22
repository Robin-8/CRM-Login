const express = require('express')
const {createCustomer, login, updateUser, getAllUsers, getUserById} = require('../controllers/userController.js')
const {authMiddleware} = require('../middilware/authMiddleware.js')
const {admin}=require("../middilware/roleMiddilweare.js")

const router = express.Router()


router.post('/createCustomer',createCustomer)
router.post('/login',login)
router.patch('/updating/:id',updateUser,authMiddleware)
router.get("/getAllUser", authMiddleware, admin, getAllUsers);
router.get("/:id", getUserById);

module.exports = router;