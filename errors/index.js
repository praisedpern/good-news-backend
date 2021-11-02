exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg })
    }
}

exports.handleServerErrors = (err, req, res, next) => {
    console.log({ unhandled_error: err })
    res.status(500).send({ msg: 'Internal server error' })
}