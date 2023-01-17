const { getCommentsByReview_id } = require('../controllers/app_controller')
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

const fetchCommentsByReview_id = (review_id) => {
    const getCommentsByReview_idStr = `SELECT * FROM comments WHERE review_id = $1`
    return db.query(getCommentsByReview_idStr, [review_id]).then(results => {
        if (results.rows.length === 0) {
            return Promise.reject({status: 400, message: "review_id not found!"})
        }
        return results.rows
    })
}

module.exports = { fetchCategories, fetchReviews, fetchCommentsByReview_id }