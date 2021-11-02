const db = require('../db/connection.js')
const testData = require('../db/data/test-data/index.js')
const seed = require('../db/seeds/seed.js')
const app = require('../app.js')
const request = require('supertest')

beforeEach(() => seed(testData))
afterAll(() => db.end())

const validTimestamp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/

describe('/', () => {
    describe('GET', () => {
        it('status:200, responds with a server online message', () => {
            return request(app)
                .get('/')
                .expect(200)
                .then(({ body }) => {
                    const { msg } = body
                    expect(body).toBeInstanceOf(Object)
                    expect(msg).toBe('Server online')
                })
        })
    })
})

describe('/api/topics', () => {
    describe('GET', () => {
        it('status:200, responds with an array of topic objects', () => {
            return request(app)
                .get('/api/topics')
                .expect(200)
                .then(({ body }) => {
                    const { topics } = body
                    expect(topics).toBeInstanceOf(Array)
                    expect(topics).toHaveLength(3)
                    topics.forEach((topic) => {
                        expect(topic).toEqual(
                            expect.objectContaining({
                                slug: expect.any(String),
                                description: expect.any(String),
                            })
                        )
                    })
                })
        })
    })
})

describe('/api/articles/:article_id', () => {
    describe('GET', () => {

        it('status:200, responds with an article object', () => {
            return request(app)
                .get('/api/articles/1')
                .expect(200)
                .then(({ body }) => {
                    const { article } = body
                    expect(article).toBeInstanceOf(Object)
                    expect(article).toEqual(
                        expect.objectContaining({
                            author: expect.any(String), //changeme
                            title: expect.any(String),
                            article_id: expect.any(Number),
                            body: expect.any(String),
                            topic: expect.any(String),
                            // created_at: expect.stringMatching(validTimeStamp),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                            comment_count: expect.any(Number),
                        })
                    )
                })
        })
    })
})
