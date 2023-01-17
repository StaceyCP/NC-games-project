const express = require('express')
const app = express()
const {
    getCategories,
    getReviews,
    getReviewById
} = require('./controllers/app_controller')

app.get('/api/categories', getCategories)

app.get('/api/reviews', getReviews)

app.get('/api/reviews/:review_id', getReviewById)

app.all('/*', (req, res) => {
    res.status(404).send('Not Found :(')
})

app.use((err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send('Bad Request!')
    }
    next(err)
})

app.use((err, req, res, next) => {
    if (err.message) {
        res.status(err.status).send(err.message)
    }
    next(err)
})

app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send('Internal server error!');
})

module.exports = { app }