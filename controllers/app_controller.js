const comments = require('../db/data/test-data/comments')
const { 
    fetchCategories,
    fetchReviews,
    fetchCommentsByReview_id
} = require('../models/app_model')

const getCategories = (req, res, next) => {
    fetchCategories().then((categories) => {
        res.status(200).send(categories)
    }).catch(next)
}

const getReviews = (req, res, next) => {
    fetchReviews().then((reviews) => {
        res.status(200).send(reviews)
    })
}

const getCommentsByReview_id = (req, res, next) => {
    const review_id = req.params.review_id
    fetchCommentsByReview_id(review_id).then(comments => {
        res.status(200).send({ comments })
    }).catch(err => {
        next(err)
    })
}

module.exports = { getCategories, getReviews, getCommentsByReview_id }