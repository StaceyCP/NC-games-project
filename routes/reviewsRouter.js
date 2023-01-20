const { getReviews, getReviewById, getCommentsByReview_id, postCommentWithReview_id, patchReviewById } = require('../controllers/app_controller');
const reviewsRouter = require('express').Router();

reviewsRouter.get('/', getReviews)
reviewsRouter.get('/:review_id', getReviewById)
reviewsRouter.get('/:review_id/comments', getCommentsByReview_id)
reviewsRouter.post('/:review_id/comments', postCommentWithReview_id)
reviewsRouter.patch('/:review_id', patchReviewById)

module.exports = reviewsRouter