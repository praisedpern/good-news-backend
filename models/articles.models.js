const db = require('../db/connection')

exports.selectArticleById = (id) => {
    if (!id.match(/^\d+$/)) {
        return Promise.reject({
            status: 400,
            msg: `Invalid ID: ${id}`,
        })
    }
    let queryStr = `
        SELECT articles.*, COUNT(comments.author)
        AS comment_count
        FROM articles
        LEFT JOIN comments AS comments
        ON articles.article_id = comments.article_id
        WHERE articles.article_id = ${id}
        GROUP BY articles.article_id;
    `
    return db.query(queryStr).then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({
                status: 404,
                msg: `ID not found: ${id}`,
            })
        }
        return result
    })
}
