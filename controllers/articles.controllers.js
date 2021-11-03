const {
    selectArticleById,
    updateArticleVotes,
} = require('../models/articles.models')

exports.getArticleById = ({ params }, res, next) => {
    const id = params.id
    return selectArticleById(id)
        .then((result) => {
            return res.status(200).send({ article: result })
        })
        .catch(next)
}

exports.patchArticleVotes = ({ params, body }, res, next) => {
    const id = params.id
    const votes = body.inc_votes
    return updateArticleVotes(id, votes)
        .then(() => {
            return selectArticleById(id).then((result) => {
                return res.status(202).send({ article: result })
            })
        })
        .catch(next)
}
