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
                    expect(topics).toHaveLength(testData.topicData.length)
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
                    expect(msg).toEqual(`Invalid ID`)
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
                    expect(msg).toEqual(`Invalid ID`)
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

describe('/api/articles', () => {
    describe('GET', () => {
        it('status:200, responds with an array of article objects', () => {
            return request(app)
                .get('/api/articles')
                .expect(200)
                .then(({ body }) => {
                    const { articles } = body
                    expect(articles).toBeInstanceOf(Array)
                    expect(articles).toHaveLength(testData.articleData.length)
                    articles.forEach((article) => {
                        expect.objectContaining({
                            author: expect.any(String),
                            title: expect.any(String),
                            article_id: expect.any(Number),
                            topic: expect.any(String),
                            created_at: expect.stringMatching(validTimestamp),
                            votes: expect.any(Number),
                            comment_count: expect.any(Number),
                        })
                    })
                })
        })
        describe('?sort_by', () => {
            it('status:200, sorts by date, descending by default', () => {
                return request(app)
                    .get(`/api/articles`)
                    .expect(200)
                    .then(({ body }) => {
                        const { articles } = body
                        expect(articles).toBeSortedBy('created_at', {
                            descending: true,
                        })
                    })
            })

            it('status:200, sorts by the field passed in the query', () => {
                // const testSortBy = (sortBy) => {
                //     return request(app)
                //         .get(`/api/articles?sort_by=${sortBy}`)
                //         .expect(200)
                //         .then(({ body }) => {
                //             const { articles } = body
                //             expect(articles).toBeSortedBy(sortBy, {
                //                 descending: true,
                //             })
                //         })
                // }
                // const queriesToTest = [
                //     'author',
                //     'title',
                //     'article_id',
                //     'topic',
                //     'created_at',
                //     'votes',
                //     'comment_count',
                // ]
                // queriesToTest.forEach((query) => {
                //     testSortBy(query)
                // })
                const sortBy = 'comment_count'
                return request(app)
                    .get(`/api/articles?sort_by=${sortBy}`)
                    .expect(200)
                    .then(({ body }) => {
                        const { articles } = body
                        expect(articles).toBeSortedBy(sortBy, {
                            descending: true,
                        })
                    })
            })
            it('status:400, responds with bad request when passed with invalid column', () => {
                return request(app)
                    .get(`/api/articles?sort_by=notAQuery`)
                    .expect(400)
                    .then(({ body }) => {
                        expect(body).toEqual({
                            msg: 'Invalid query',
                        })
                    })
            })
        })
        describe('?order', () => {
            it('status:200, orders the sorted articles ascending or descending', () => {
                return request(app)
                    .get(`/api/articles?order=asc`)
                    .expect(200)
                    .then(({ body }) => {
                        const { articles } = body
                        expect(articles).toBeSortedBy('created_at')
                    })
                    .then(() => {
                        return request(app)
                            .get(`/api/articles?order=desc`)
                            .expect(200)
                            .then(({ body }) => {
                                const { articles } = body
                                expect(articles).toBeSortedBy('created_at', {
                                    descending: true,
                                })
                            })
                    })
            })
            it('status:400, responds with bad request when passed with invalid order', () => {
                return request(app)
                    .get(`/api/articles?order=notAnOrder`)
                    .expect(400)
                    .then(({ body }) => {
                        expect(body).toEqual({
                            msg: 'Invalid query',
                        })
                    })
            })
        })
        describe('?topic', () => {
            const filterByTopicTest = (topicToUse, status) => {
                return request(app)
                    .get(`/api/articles?topic=${topicToUse}`)
                    .expect(status)
            }
            it('status:200, filters the articles, returning only those matching the passed topic column', () => {
                const topicToUse = 'mitch'
                return filterByTopicTest(topicToUse, 200).then(({ body }) => {
                    const { articles } = body
                    articles.forEach((article) => {
                        expect(article).toEqual(
                            expect.objectContaining({
                                topic: topicToUse,
                            })
                        )
                    })
                })
            })
            it('status:404, responds with not found if no articles with topic found', () => {
                const topicToUse = 'notATopic'
                return filterByTopicTest(topicToUse, 404).then(({body}) => {
                    const { msg } = body
                    expect(msg).toBe(`No articles found with topic: ${topicToUse}`)
                })
            })
        })
    })
})
