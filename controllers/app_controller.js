const { fetchCategories } = require('../models/app_model')

const getCategories = (req, res, next) => {
    fetchCategories().then((categories) => {
        res.status(200).send(categories)
    }).catch(next)
}

module.exports = { getCategories }