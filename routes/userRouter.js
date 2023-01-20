const { getUsers } = require('../controllers/app_controller');

const userRouter = require('express').Router();

userRouter.get('/', getUsers)

module.exports = userRouter