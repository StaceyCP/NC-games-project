const { 
    fetchCategories,
    fetchReviews
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

module.exports = { getCategories, getReviews }