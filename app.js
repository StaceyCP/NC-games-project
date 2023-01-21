const express = require('express')
const app = express()
const apiRouter = require('./routes/apiRouter')

const {
    handleServerErrors,
    handleCustomErrors,
    handlePSQLerrors
} = require('./controllers/error_controller')

app.use(express.json())
app.use('/api', apiRouter)



app.all('/*', (req, res) => {
    res.status(404).send('Not Found :(')
})

app.use(handlePSQLerrors)
app.use(handleCustomErrors)
app.use(handleServerErrors)

module.exports = { app }