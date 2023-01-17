const db = require('../db/connection')

const fetchCategories = () => {
    const getCategoriesStr = `SELECT * FROM categories`
    return db.query(getCategoriesStr).then((result) => {
        return result.rows
    })
}

const fetchReviews = () => {
    const getReviewsStr = `SELECT reviews.*, COUNT(comments.comment_id) AS comment_count FROM reviews
    LEFT JOIN comments
    ON reviews.review_id = comments.review_id
    GROUP BY reviews.review_id
    ORDER BY created_at DESC`
    return db.query(getReviewsStr).then((result) => {
        return result.rows
    })
}

const fetchReviewById = (review_id) => {
    const reviewByIdQueryStr = `SELECT * FROM reviews WHERE review_id = $1`
    return db.query(reviewByIdQueryStr, [review_id]).then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({status: 404, message: 'id Not Found!'});
        } else {
            return result.rows
        }
    })
}

module.exports = { fetchCategories, fetchReviews, fetchReviewById }
