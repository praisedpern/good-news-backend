exports.handlePsqlErrors = (err, req, res, next) => {
    switch (err.code) {
        case '22P02':
            res.status(400).send({ msg: 'Invalid ID' })
            break
        case '42703':
            res.status(400).send({ msg: 'Invalid query' })
            break
        case '42P01':
            console.log(err)
            res.status(500).send({ msg: 'Internal server error' })
            break
        case '23503':
            res.status(404).send({ msg: `Article not found` })
            break
        default:
            next(err)
    }
}

exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg })
    } else next(err)
}

exports.handleServerErrors = (err, req, res, next) => {
    console.log({ unhandled_error: err })
    res.status(500).send({ msg: 'Internal server error' })
}
