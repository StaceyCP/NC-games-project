const comments = require('../db/data/test-data/comments')
const { 
    fetchCategories,
    fetchReviews,
    fetchReviewById,
    fetchCommentsByReview_id, 
    addCommentByReview_id,
    fetchUsers
} = require('../models/app_model')

const getCategories = (req, res, next) => {
    fetchCategories().then((categories) => {
        res.status(200).send(categories)
    }).catch(next)
}

const getReviews = (req, res, next) => {
    fetchReviews().then((reviews) => {
        res.status(200).send({reviews})
    })
}

const getReviewById = (req, res, next) => {
    const { review_id } = req.params
    fetchReviewById(review_id).then((review) => {
        res.status(200).send(review[0])
    }).catch(err => {
        next(err)
    })
}

const getCommentsByReview_id = (req, res, next) => {
    const review_id = req.params.review_id

    fetchReviewById(review_id)
    .then(()=>{
        return fetchCommentsByReview_id(review_id)
    })
    .then((comments) => {
        res.status(200).send({ comments })
    })
    .catch(next)
}

const postCommentWithReview_id = (req, res, next) => {
    const review_id = req.params.review_id
    const { body, username } = req.body
    fetchReviewById(review_id).then(() => {
        return addCommentByReview_id(review_id, username, body)
    })
    .then(newComment => {
        res.status(201).send({newComment})
    })
    .catch(next)
}

const getUsers = (req, res, next) => {
    fetchUsers().then((users) => {
        res.status(200).send({ users })
    })
}

module.exports = { getCategories, getReviews, getCommentsByReview_id, getReviewById, postCommentWithReview_id, getUsers }