const express = require('express')
const app = express()
const {
    getCategories,
    getReviews,
    getReviewById,
    getCommentsByReview_id,
    postCommentWithReview_id,
    getUsers
} = require('./controllers/app_controller')

const {
    handleServerErrors,
    handleCustomErrors,
    handlePSQLerrors
} = require('./controllers/error_controller')

app.use(express.json())

app.get('/api/categories', getCategories)
app.get('/api/reviews', getReviews)
app.get('/api/reviews/:review_id', getReviewById)
app.get('/api/reviews/:review_id/comments', getCommentsByReview_id)
app.get('/api/users', getUsers)

app.post('/api/reviews/:review_id/comments', postCommentWithReview_id)

app.all('/*', (req, res) => {
    res.status(404).send('Not Found :(')
})

app.use(handlePSQLerrors)
app.use(handleCustomErrors)
app.use(handleServerErrors)

module.exports = { app }