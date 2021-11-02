const { selectArticleById } = require('../models/articles.models')

exports.getArticleById = ({params}, res, next) => {
    const id = params.id
    return selectArticleById(id).then(({ rows }) => {
        rows[0].comment_count = parseInt(rows[0].comment_count)
        return res.status(200).send({ article: rows[0] })
    })
    .catch(next)
}