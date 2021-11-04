const {
    selectArticleById,
    updateArticleVotes,
    selectArticles,
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

exports.getArticles = (req, res, next) => {
    const { sort_by, order } = req.query
    return selectArticles(sort_by, order)
        .then((result) => {
            return res.status(200).send({ articles: result })
        })
        .catch(next)
}
