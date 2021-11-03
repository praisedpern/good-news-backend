const db = require('../db/connection.js')
const testData = require('../db/data/test-data/index.js')
const seed = require('../db/seeds/seed.js')
const app = require('../app.js')
const request = require('supertest')

beforeEach(() => seed(testData))
afterAll(() => db.end())

const validTimestamp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/

const patchArticleObj = {
    inc_votes: 1,
}

beforeEach(() => {
    patchArticleObj.inc_votes = 1
})

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
        it('status:200, responds with the correct article object', () => {
            const idToUse = 2
            return request(app)
                .get(`/api/articles/${idToUse}`)
                .expect(200)
                .then(({ body }) => {
                    const { article } = body
                    expect(article).toEqual(
                        expect.objectContaining({
                            article_id: idToUse,
                            title: expect.any(String),
                            body: expect.any(String),
                            votes: expect.any(Number),
                            topic: expect.any(String),
                            author: expect.any(String),
                            created_at: expect.stringMatching(validTimestamp),
                            comment_count: expect.any(Number),
                        })
                    )
                })
        })
        it('status:400, responds with bad request when passed with invalid ID', () => {
            const idToUse = 'notAnId'
            return request(app)
                .get(`/api/articles/${idToUse}`)
                .expect(400)
                .then(({ body }) => {
                    const { msg } = body
                    expect(msg).toEqual(`Invalid ID: ${idToUse}`)
                })
        })
        it('status:404, responds with not found when passed ID not found', () => {
            const idToUse = '9000'
            return request(app)
                .get(`/api/articles/${idToUse}`)
                .expect(404)
                .then(({ body }) => {
                    const { msg } = body
                    expect(msg).toEqual(`ID not found: ${idToUse}`)
                })
        })
    })
    describe('PATCH', () => {
        it('status:202, responds with the updated article object', () => {
            const idToUse = 1
            patchArticleObj.inc_votes = 1

            let responseToCompare

            return request(app)
                .get(`/api/articles/${idToUse}`)
                .expect(200)
                .then(({ body }) => {
                    responseToCompare = { ...body }
                    responseToCompare.article.votes += patchArticleObj.inc_votes
                    return
                })
                .then(() => {
                    return request(app)
                        .patch(`/api/articles/${idToUse}`)
                        .send(patchArticleObj)
                        .expect(202)
                        .then(({ body }) => {
                            expect(body).toEqual(responseToCompare)
                        })
                })
        })
        it('status:400, responds with bad request when passed with invalid ID', () => {
            const idToUse = 'notAnId'
            patchArticleObj.inc_votes = 1

            return request(app)
                .patch(`/api/articles/${idToUse}`)
                .send(patchArticleObj)
                .expect(400)
                .then(({ body }) => {
                    const { msg } = body
                    expect(msg).toEqual(`Invalid ID: ${idToUse}`)
                })
        })
        it('status:404. responds with not found when passed ID not found in db', () => {
            const idToUse = '9000'
            return request(app)
                .patch(`/api/articles/${idToUse}`)
                .send(patchArticleObj)
                .expect(404)
                .then(({ body }) => {
                    const { msg } = body
                    expect(msg).toEqual(`ID not found: ${idToUse}`)
                })
        })
    })
})
