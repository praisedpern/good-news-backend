const db = require('../db/connection')
const format = require('pg-format')

exports.selectArticleById = (id) => {
    let queryStr = `
        SELECT articles.*, COUNT(comments.author)
        AS comment_count
        FROM articles
        LEFT JOIN comments AS comments
        ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id;
    `
    return db.query(queryStr, [id]).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({
                status: 404,
                msg: `ID not found: ${id}`,
            })
        }
        rows[0].comment_count = parseInt(rows[0].comment_count)
        return rows[0]
    })
}

exports.updateArticleVotes = (id, votes) => {
    let queryStr = `
        UPDATE articles
        SET votes = votes + $1
        WHERE articles.article_id = $2
        RETURNING *;
    `
    return db.query(queryStr, [votes, id]).then((result) => {
        return result
    })
}
exports.selectArticles = (sort_by = 'created_at', order = 'desc', topic) => {
    const validOrders = ['asc', 'desc']

    if (!validOrders.includes(order))
        throw { status: 400, msg: 'Invalid query' }

    if (topic) console.log(topic)

    let queryStr = `
        SELECT articles.*, COUNT(comments.author)
        AS comment_count
        FROM articles
        LEFT JOIN comments AS comments
        ON articles.article_id = comments.article_id
        `
    if (topic) {
        queryStr += `
        WHERE topic = '${topic}'
        `
    }
    queryStr += `
        GROUP BY articles.article_id
        ORDER BY ${sort_by} ${order}
        ;
    `
    return db.query(queryStr).then(({ rows }) => {
        if (rows.length) rows[0].comment_count = parseInt(rows[0].comment_count)
        return rows
    })
}
