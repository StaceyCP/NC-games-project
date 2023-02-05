exports.handlePSQLerrors = (err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send('Bad Request!')
    } else if (err.code === '23503') {
        res.status(404).send('The request field you entered currently does not exist')
    } else if (err.code === '23502') {
        res.status(400).send('Bad Request - request body is lacking the required fields!')
    } else if (err.code === '2201W') {
        res.status(400).send('Bad Request - limit must not be negative')
    } else if (err.code === '23505') {
        res.status(400).send('Sorry this username is taken :(')
    } else (
        next(err)
    )
}

exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send(err.message)
    } else (
        next(err)
    )
}

exports.handleServerErrors = (err, req, res, next) => {
    console.log(err)
    res.status(500).send('Internal server error!');
}
