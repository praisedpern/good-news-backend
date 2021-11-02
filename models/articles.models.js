const db = require('../db/connection')

exports.selectArticleById = (id) => {
    let queryStr = `
        SELECT articles.*, COUNT(comments.author)
        AS comment_count
        FROM articles
        LEFT JOIN comments AS comments
        ON articles.article_id = comments.article_id
        WHERE articles.article_id = ${id}
        GROUP BY articles.article_id;
    `
    return db.query(queryStr).then((result)=>{
        return result
    })
}