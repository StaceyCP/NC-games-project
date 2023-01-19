const { response } = require('express')
const comments = require('../db/data/test-data/comments')
const { 
    fetchCategories,
    fetchReviews,
    fetchReviewById,
    fetchCommentsByReview_id, 
    addCommentByReview_id,
    updateReviewById,
    fetchUsers,
    removeCommentById,
    fetchCommentsByComment_id,
    fetchCategoriesByName
} = require('../models/app_model')

exports.getCategories = (req, res, next) => {
    fetchCategories().then((categories) => {
        res.status(200).send(categories)
    }).catch(next)
}

exports.getReviews = (req, res, next) => {
    const { category, sort_by, order } = req.query
    if (category) {
        fetchCategoriesByName(category).then(() => {
            fetchReviews(category, sort_by, order).then((reviews) => {
                res.status(200).send({reviews})
            })
        }).catch(next)
    } else (
        fetchReviews(category, sort_by, order).then((reviews) => {
            res.status(200).send({reviews})
        })
        .catch(next)
    )
}

exports.getReviewById = (req, res, next) => {
    const { review_id } = req.params
    fetchReviewById(review_id).then((review) => {
        res.status(200).send(review[0])
    }).catch(err => {
        next(err)
    })
}

exports.getCommentsByReview_id = (req, res, next) => {
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

exports.postCommentWithReview_id = (req, res, next) => {
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

exports.patchReviewById = (req, res, next) => {
    const review_id = req.params.review_id
    const { inc_votes } = req.body
    updateReviewById(review_id, inc_votes)
    .then((updatedReview) => {
        res.status(200).send({ updatedReview })
    })
    .catch(next)
}

exports.getUsers = (req, res, next) => {
    fetchUsers().then((users) => {
        res.status(200).send({ users })
    })
    .catch(next)
}

exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params
    fetchCommentsByComment_id(comment_id).then(() => {
        removeCommentById(comment_id)
        .then(() => {
            res.status(204).send()
        })
    })
    .catch(next)
}