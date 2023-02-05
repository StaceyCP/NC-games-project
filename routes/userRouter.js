const { getUsers, getUserByUsername, postUser } = require('../controllers/app_controller');

const userRouter = require('express').Router();

userRouter.get('/', getUsers)
userRouter.get('/:username', getUserByUsername)
userRouter.post('/', postUser)

module.exports = userRouter