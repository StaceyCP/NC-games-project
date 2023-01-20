const { deleteCommentById } = require('../controllers/app_controller');

const commentsRouter = require('express').Router();

commentsRouter.delete('/:comment_id', deleteCommentById)

module.exports = commentsRouter