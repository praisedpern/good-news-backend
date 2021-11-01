const db = require('../connection')

const seed = (data) => {
    const { articleData, commentData, topicData, userData } = data
    // 1. create tables
    return db
        .query('DROP TABLE IF EXISTS topics, articles, users, comments;')
        .then(() => {
            return db.query(`CREATE TABLE topics (
        slug VARCHAR UNIQUE NOT NULL,
        description VARCHAR NOT NULL
      );`)
        })
        .then(() => {
            return db.query(`CREATE TABLE users (
                username VARCHAR(50) UNIQUE NOT NULL,
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
}

module.exports = seed
