const { getReviews, getReviewById, getCommentsByReview_id, postCommentWithReview_id, patchReviewById, postReview } = require('../controllers/app_controller');
const reviewsRouter = require('express').Router();

reviewsRouter
.route('/')
.get(getReviews)
.post(postReview)

reviewsRouter
.route('/:review_id')
.get(getReviewById)
.patch(patchReviewById)

reviewsRouter
.route('/:review_id/comments')
.get(getCommentsByReview_id)
.post(postCommentWithReview_id)

module.exports = reviewsRouter