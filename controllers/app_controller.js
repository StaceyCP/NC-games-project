const { 
    fetchCategories,
    fetchReviews,
    fetchReviewById
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

module.exports = { getCategories, getReviews, getReviewById }
