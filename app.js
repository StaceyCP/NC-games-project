const express = require('express')
const app = express()
const {
    getCategories,
    getReviews
} = require('./controllers/app_controller')

app.get('/api/categories', getCategories)

app.get('/api/reviews', getReviews)

app.all('/*', (req, res) => {
    res.status(404).send('Not Found :(')
})

app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send('Internal server error!');
})

module.exports = { app }