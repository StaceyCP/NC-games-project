exports.handlePSQLerrors = (err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send('Bad Request!')
    } else (
        next(err)
    )
}

exports.handleCustomErrors = (err, req, res, next) => {
    if (err.message) {
        res.status(err.status).send(err.message)
    } else (
        next(err)
    )
}

exports.handleServerErrors = (err, req, res, next) => {
    console.log(err)
    res.status(500).send('Internal server error!');
}
