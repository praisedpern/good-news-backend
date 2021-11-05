const db = require('../db/connection')
const format = require('pg-format')

exports.selectArticleComments = (id) => {
    return db
        .query(
            `
        SELECT
        comment_id, votes, created_at, author, body
        FROM comments
        WHERE article_id = $1
        ;
    `,
            [id]
        )
        .then(({ rows }) => {
            return rows
        })
}
