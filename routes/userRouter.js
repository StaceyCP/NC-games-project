const { getUsers, getUserByUsername } = require('../controllers/app_controller');

const userRouter = require('express').Router();

userRouter.get('/', getUsers)
userRouter.get('/:username', getUserByUsername)

module.exports = userRouter