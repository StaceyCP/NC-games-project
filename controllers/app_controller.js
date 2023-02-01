const fs = require('fs/promises')
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
    fetchCategoriesByName,
    fetchUserByUsername,
    updateCommentByComment_id, 
    createReview,
    createCategory
} = require('../models/app_model')

exports.getApi = (req, res, next) => {
    fs.readFile('./endpoints.json','UTF-8').then((data) => {
        res.status(200).send(JSON.parse(data))
        })

}

exports.getCategories = (req, res, next) => {
    fetchCategories().then((categories) => {
        res.status(200).send(categories)
    }).catch(next)
}

exports.postCategory = (req, res, next) => {
    const categoryContent = req.body
    createCategory(categoryContent).then((newCategory) => {
        res.status(201).send({newCategory})
    }).catch(next)
}

exports.getReviews = (req, res, next) => {
    const { category, sort_by, order, limit, p } = req.query
    if (category) {
        fetchCategoriesByName(category).then(() => {
            fetchReviews( category, sort_by, order, limit, p).then((reviews) => {
                res.status(200).send({reviews})
            })
        }).catch(next)
    } else (
        fetchReviews(category, sort_by, order, limit, p).then((reviews) => {
            res.status(200).send({reviews})
        })
        .catch(next)
    )
}

exports.postReview = (req, res, next) => {
    const reviewContent = req.body
    createReview(reviewContent).then((newReview_id) => {
        fetchReviewById(newReview_id).then((newReview) => {
            res.status(201).send({ newReview })
        })
    }).catch(next)
}

exports.getReviewById = (req, res, next) => {
    const { review_id } = req.params
    fetchReviewById(review_id).then((review) => {
        res.status(200).send({review})
    }).catch(err => {
        next(err)
    })
}

exports.getCommentsByReview_id = (req, res, next) => {
    const review_id = req.params.review_id
    const { limit, p} = req.query
    fetchReviewById(review_id)
    .then(()=>{
        return fetchCommentsByReview_id(review_id, limit, p)
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

exports.patchCommentById = (req, res, next) => {
    const { comment_id } = req.params
    const { inc_votes } = req.body
    updateCommentByComment_id(comment_id, inc_votes)
    .then((updatedComment) => {
        res.status(200).send({ updatedComment })
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

exports.getUserByUsername = (req, res, next) => {
    const { username } = req.params
    fetchUserByUsername(username)
    .then(user => {
        res.status(200).send({ user })
    })
    .catch(next)
}