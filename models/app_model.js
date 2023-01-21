const db = require('../db/connection')

exports.fetchCategories = () => {
    const getCategoriesStr = `SELECT * FROM categories`
    return db.query(getCategoriesStr).then((result) => {
        return result.rows
    })
}

exports.fetchCategoriesByName = (category) => {
    const categoryNameQueryStr = `SELECT * FROM categories WHERE slug = $1`
    return db.query(categoryNameQueryStr, [category]).then(results => {
        if (results.rows.length === 0) {
            return Promise.reject({ status: 404, message: 'Category not found :(' })
        }
        return results.rows
    })
}

exports.fetchReviews = (category, sort_by = 'created_at', order = 'DESC') => {
    const acceptedOrderTerms = [ 'ASC', 'DESC', 'asc', 'desc']
    const acceptedSort_byTerms = ['created_at', 'review_id', 'comment_count', 'owner', 'votes', 'title']
    const categoryInsert = []
    let getReviewsStr = `SELECT reviews.*, COUNT(comments.comment_id) AS comment_count FROM reviews
    LEFT JOIN comments
    ON reviews.review_id = comments.review_id`

    if (category) {
        categoryInsert.push(category)
        getReviewsStr += ` WHERE category = $1`
    }

    getReviewsStr += ` GROUP BY reviews.review_id 
    ORDER BY ${sort_by} ${order.toUpperCase()}`

    if (!acceptedOrderTerms.includes(order) || !acceptedSort_byTerms.includes(sort_by)){
       return Promise.reject({status: 400, message: 'Bad Request - Not an accepted query'})
    }

    return db.query(getReviewsStr, categoryInsert).then((result) => {
        return result.rows
    })
}

exports.fetchReviewById = (review_id) => {
    const reviewByIdQueryStr = `
    SELECT reviews.*, COUNT(comments.comment_id) AS comment_count FROM reviews
    LEFT JOIN comments
    ON reviews.review_id = comments.review_id
    WHERE reviews.review_id = $1
    GROUP BY reviews.review_id`

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
        return results.rows
    })
}

exports.updateReviewById = (review_id, inc_votes) => {
    const updateVotesQueryStr = `UPDATE reviews SET votes = ( votes + $1 ) WHERE review_id = $2 RETURNING *`
    return db.query(updateVotesQueryStr, [inc_votes, review_id]).then(results => {
        if (results.rows.length === 0) {
            return Promise.reject({status: 404, message: 'id Not Found!'});
        } else { 
            return results.rows
        }
    })
}

exports.fetchUsers = () => {
    const getUsersQueryStr = `SELECT * FROM users`
    return db.query(getUsersQueryStr).then(result => {
        return result.rows
    })
}

exports.fetchUserByUsername = (username) => {
    const getUserByUsernameQueryStr = `SELECT * FROM users WHERE username = $1`
    return db.query(getUserByUsernameQueryStr, [username]).then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({status:404, message: "username not found :("})
        }
        return result.rows
    })
}

exports.fetchCommentsByComment_id = (comment_id) => {
    const getCommentByComment_idStr = `SELECT * FROM comments WHERE comment_id = $1`
    return db.query(getCommentByComment_idStr, [comment_id]).then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({status: 404, message: "comment_id not found"})
        }
        return result.rows
    })
}

exports.removeCommentById = (comment_id) => {
    const removeCommentQueryStr = `DELETE FROM comments WHERE comment_id = $1`
    return db.query(removeCommentQueryStr, [comment_id])
}

