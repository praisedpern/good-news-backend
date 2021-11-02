const { selectArticleById } = require('../models/articles.models')

exports.getArticleById = ({params}, res, next) => {
    const id = params.id
    return selectArticleById(id).then(({ rows }) => {
        return res.status(200).send({ article: rows[0] })
    })
}