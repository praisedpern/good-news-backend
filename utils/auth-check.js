const { createHash } = require('crypto')
const authCheck = require('express').Router()

authCheck.use(({ query }, res, next) => {
    if (process.env.NODE_ENV === 'test') return next()
    const hashToCheck = process.env.AUTHTOKEN
    const hash = createHash('sha256');
    if (query.token) hash.update(query.token);
    const currentHash = hash.digest('hex')
    console.log(currentHash)

    if (hashToCheck !== currentHash) {
            return res.status(403).send({msg: 'Not authorised'})
        }
    next()
})

module.exports = authCheck
