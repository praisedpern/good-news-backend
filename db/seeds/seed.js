const db = require('../connection')
const format = require('pg-format')

const seed = (data) => {
    const { articleData, commentData, topicData, userData } = data
    // 1. create tables
    return (
        db
            .query('DROP TABLE IF EXISTS topics, articles, users, comments;')
            .then(() => {
                return db.query(`CREATE TABLE topics (
        slug VARCHAR PRIMARY KEY,
        description VARCHAR NOT NULL
      );`)
            })
            .then(() => {
                return db.query(`CREATE TABLE users (
                username VARCHAR(50) PRIMARY KEY,
                avatar_url VARCHAR DEFAULT 'https://memegenerator.net/img/instances/72838539.jpg',
                name VARCHAR NOT NULL 
      );`)
            })
            .then(() => {
                return db.query(`CREATE TABLE articles (
                article_id SERIAL PRIMARY KEY,
                title VARCHAR NOT NULL,
                body VARCHAR NOT NULL,
                votes INT NOT NULL DEFAULT 0,
                topic VARCHAR NOT NULL REFERENCES topics(slug),
                author VARCHAR(50) NOT NULL REFERENCES users(username),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`)
            })
            .then(() => {
                return db.query(`CREATE TABLE comments (
                comment_id SERIAL PRIMARY KEY,
                author VARCHAR(50) NOT NULL REFERENCES users(username),
                article_id INT NOT NULL REFERENCES articles(article_id),
                votes INT NOT NULL DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                body VARCHAR NOT NULL
      );`)
            })
            // 2. insert data
            .then(() => {
                const queryStr = format(
                    `INSERT INTO topics (
                    slug, description
                    ) VALUES %L;`,
                    topicData.map((topic) => [topic.slug, topic.description])
                )
                return db.query(queryStr)
            })
            .then(() => {
                const queryStr = format(
                    `INSERT INTO users (
                    username, avatar_url, name
                    ) VALUES %L;`,
                    userData.map((user) => [
                        user.username,
                        user.avatar_url,
                        user.name,
                    ])
                )
                return db.query(queryStr)
            })
            .then(() => {
                const queryStr = format(
                    `INSERT INTO articles (
                    title, body, votes, topic, author, created_at
                    ) VALUES %L;`,
                    articleData.map((article) => [
                            article.title,
                            article.body,
                            article.votes,
                            article.topic,
                            article.author,
                            article.created_at,
                        ]
                    )
                )
                return db.query(queryStr)
            })
            .then(() => {
                const queryStr = format(
                    `INSERT INTO comments (
                    author, article_id, votes, created_at, body
                    ) VALUES %L;`,
                    commentData.map((comment) => [
                            comment.author,
                            comment.article_id,
                            comment.votes,
                            comment.created_at,
                            comment.body,
                        ]
                    )
                )
                return db.query(queryStr)
            })
    )
}

module.exports = seed
