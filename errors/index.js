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
        case '23502':
            res.status(400).send({msg: 'Invalid property in request body'})
        break
        case '23503':
            const responseMsg = err.detail.match('articles')
                ? 'Article'
                : 'Username'
            res.status(404).send({ msg: `${responseMsg} not found` })
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
