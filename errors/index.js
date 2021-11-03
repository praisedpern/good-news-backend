exports.handlePsqlErrors = (err, req, res, next) => {
    switch (err.code) {
        case '22P02':
            res.status(400).send({ msg: 'Invalid ID' })
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
