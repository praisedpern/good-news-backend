const { selectTopics } = require('../models/select-topics')

exports.getTopics = (req, res, next) => {
    return selectTopics().then(({ rows }) => {
        return res.status(200).send({ topics: rows })
    })
}