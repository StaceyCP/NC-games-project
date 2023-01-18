const db = require('../db/connection')

exports.fetchCategories = () => {
    const getCategoriesStr = `SELECT * FROM categories`
    return db.query(getCategoriesStr).then((result) => {
        return result.rows
    })
}

exports.fetchReviews = () => {
    const getReviewsStr = `SELECT reviews.*, COUNT(comments.comment_id) AS comment_count FROM reviews
    LEFT JOIN comments
    ON reviews.review_id = comments.review_id
    GROUP BY reviews.review_id
    ORDER BY created_at DESC`
    return db.query(getReviewsStr).then((result) => {
        return result.rows
    })
}

exports.fetchReviewById = (review_id) => {
    const reviewByIdQueryStr = `SELECT * FROM reviews WHERE review_id = $1`
    return db.query(reviewByIdQueryStr, [review_id]).then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({status: 404, message: 'id Not Found!'});
        } else {
            return result.rows
        }
    })
}

exports.fetchCommentsByReview_id = (review_id) => {
    const getCommentsByReview_idStr = `SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC`
    return db.query(getCommentsByReview_idStr, [review_id]).then(results => {
        return results.rows
    })
}

exports.addCommentByReview_id = (review_id, username, body) => {
    const addNewCommentQueryStr = `INSERT INTO comments (author, body, review_id) VALUES ($1, $2, $3) RETURNING *`
    return db.query(addNewCommentQueryStr, [username, body, review_id]).then((results) => {
        return results.rows[0]
    })
}

exports.updateReviewById = (review_id, inc_votes) => {
    const updateVotesQueryStr = `UPDATE reviews SET votes = ( votes + $1 ) WHERE review_id = $2 RETURNING *`
    return db.query(updateVotesQueryStr, [inc_votes, review_id]).then(results => {
        if (results.rows.length === 0) {
            return Promise.reject({status: 404, message: 'id Not Found!'});
        } else { 
            return results.rows[0]
        }
    })
}

