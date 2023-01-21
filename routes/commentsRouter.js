const { deleteCommentById, patchCommentById } = require('../controllers/app_controller');

const commentsRouter = require('express').Router();

commentsRouter
.route('/:comment_id')
.patch(patchCommentById)
.delete(deleteCommentById)

module.exports = commentsRouter