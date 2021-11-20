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

const wrongArticleObj = {
    increment_votes: 1,
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
        it('status:200, responds with the updated article object', () => {
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
                        .expect(200)
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
        it('status:400, responds with bad request when passed an object with invalid keys', () => {
            const idToUse = 1

            return request(app)
                .patch(`/api/articles/${idToUse}`)
                .send(wrongArticleObj)
                .expect(400)
                .then(({ body }) => {
                    const { msg } = body
                    expect(msg).toEqual(`Invalid property in request body`)
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
        // TODO more thorough testing on inc/dec of votes
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
                        expect(article).toEqual(
                            expect.objectContaining({
                                body: expect.any(String),
                                author: expect.any(String),
                                title: expect.any(String),
                                article_id: expect.any(Number),
                                topic: expect.any(String),
                                created_at:
                                    expect.stringMatching(validTimestamp),
                                votes: expect.any(Number),
                                comment_count: expect.any(Number),
                            })
                        )
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
                const orderToUse = 'notAnOrder'
                return request(app)
                    .get(`/api/articles?order=${orderToUse}`)
                    .expect(400)
                    .then(({ body }) => {
                        expect(body).toEqual({
                            msg: `Invalid query: ${orderToUse}`,
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
                const topicToUse = 'paper'
                return filterByTopicTest(topicToUse, 404).then(({ body }) => {
                    const { msg } = body
                    expect(msg).toBe(
                        `No articles found with topic: ${topicToUse}`
                    )
                })
            })
            it('status:400, responds with bad request when topic does not exist', () => {
                const topicToUse = 'notATopic'
                return filterByTopicTest(topicToUse, 400).then(({ body }) => {
                    const { msg } = body
                    expect(msg).toBe(`Invalid topic: ${topicToUse}`)
                })
            })
        })
        describe('?sort_by=&?order=&?topic=', () => {
            const multipleQueryTest = (
                sort_by = null,
                order = null,
                topic = null
            ) => {
                let endpointStr = '/api/articles'
                const queryArray = [sort_by, order, topic]
                let queryCounter = 0

                queryArray.forEach((query, index) => {
                    if (query !== null) {
                        if (queryCounter > 0) endpointStr += '&'
                        else endpointStr += '?'
                        switch (index) {
                            case 0:
                                endpointStr += `sort_by=`
                                break
                            case 1:
                                endpointStr += `order=`
                                break
                            case 2:
                                endpointStr += `topic=`
                                break
                        }
                        endpointStr += `${query}`
                        queryCounter++
                    }
                })
                return endpointStr
            }
            it('status:200, responds correctly to queries combined together', () => {
                return request(app)
                    .get(multipleQueryTest('author', 'asc', 'mitch'))
                    .expect(200)
                    .then(({ body }) => {
                        const { articles } = body
                        expect(articles).toBeSortedBy('author', {
                            descending: false,
                        })
                        articles.forEach((article) => {
                            expect(article).toEqual(
                                expect.objectContaining({
                                    topic: 'mitch',
                                })
                            )
                        })
                    })
                    .then(() => {
                        return request(app)
                            .get(
                                multipleQueryTest('created_at', 'desc', 'cats')
                            )
                            .expect(200)
                            .then(({ body }) => {
                                const { articles } = body
                                expect(articles).toBeSortedBy('created_at', {
                                    descending: true,
                                })
                                articles.forEach((article) => {
                                    expect(article).toEqual(
                                        expect.objectContaining({
                                            topic: 'cats',
                                        })
                                    )
                                })
                            })
                    })
            })
        })
    })
})
describe('/api/articles/:article_id/comments', () => {
    describe('GET', () => {
        it('status:200, responds with an array of comments for given article id', () => {
            const articleIdToUse = 3
            return request(app)
                .get(`/api/articles/${articleIdToUse}/comments`)
                .expect(200)
                .then(({ body }) => {
                    const { comments } = body
                    const originalComments = testData.commentData.filter(
                        (comment) => comment.article_id === articleIdToUse
                    )
                    expect(comments.length).toEqual(originalComments.length)
                    comments.forEach((comment) => {
                        expect(comment).toEqual(
                            expect.objectContaining({
                                comment_id: expect.any(Number),
                                votes: expect.any(Number),
                                created_at:
                                    expect.stringMatching(validTimestamp),
                                author: expect.any(String),
                                body: expect.any(String),
                            })
                        )
                    })
                })
        })
        it('status:400, responds with bad request if invalid article id passed', () => {
            const idToUse = 'notAnId'
            return request(app)
                .get(`/api/articles/${idToUse}/comments`)
                .expect(400)
                .then(({ body }) => {
                    const { msg } = body
                    expect(msg).toBe(`Invalid ID`)
                })
        })
        it('status:404, responds with not found when article not present or no comments', () => {
            const idToUse = 9001
            return request(app)
                .get(`/api/articles/${idToUse}/comments`)
                .expect(404)
                .then(({ body }) => {
                    const { msg } = body
                    expect(msg).toBe(
                        `No comments found for article: ${idToUse}`
                    )
                })
        })
    })
    describe('POST', () => {
        const postArticleObj = {
            username: 'butter_bridge',
            body: 'This must be where pies go when they die',
        }
        it('status:201, successfully create new comment', () => {
            const idToUse = 1
            return request(app)
                .post(`/api/articles/${idToUse}/comments`)
                .send(postArticleObj)
                .expect(201)
                .then(({ body }) => {
                    const { comment } = body
                    expect(comment).toEqual(
                        expect.objectContaining({
                            comment_id: expect.any(Number),
                            votes: expect.any(Number),
                            created_at: expect.stringMatching(validTimestamp),
                            author: expect.stringMatching(
                                postArticleObj.username
                            ),
                            body: expect.stringMatching(postArticleObj.body),
                        })
                    )
                })
                .then(() => {
                    return request(app)
                        .get(`/api/articles/${idToUse}/comments`)
                        .expect(200)
                        .then(({ body }) => {
                            const { comments } = body
                            const originalComments =
                                testData.commentData.filter(
                                    (comment) => comment.article_id === idToUse
                                )
                            expect(comments.length).toEqual(
                                originalComments.length + 1
                            )
                        })
                })
        })
        it('status:404, returns not found when article not found', () => {
            const idToUse = 9999
            return request(app)
                .post(`/api/articles/${idToUse}/comments`)
                .send(postArticleObj)
                .expect(404)
                .then(({ body }) => {
                    const { msg } = body
                    expect(msg).toEqual(`Article not found`)
                })
        })
        it('status:404, returns not found when passed with invalid username', () => {
            const newArticleObj = {
                username: 'killer_bob',
                body: 'Through the darkness of future past, the magician longs to see, one chance out between two worlds, fire walk with me!',
            }
            const idToUse = 1
            return request(app)
                .post(`/api/articles/${idToUse}/comments`)
                .send(newArticleObj)
                .expect(404)
                .then(({ body }) => {
                    const { msg } = body
                    expect(msg).toEqual(`Username not found`)
                })
        })
    })
    // TODO, what happens on post requests when none or incorrect comment content passed in?
})
describe('/api/comments/:comment_id', () => {
    describe('DELETE', () => {
        it('status:204, returns no content ', () => {
            const idToUse = 1
            return request(app)
                .delete(`/api/comments/${idToUse}`)
                .expect(204)
                .then(({ body }) => {
                    expect(body).toEqual({})
                })
                .then(() => {
                    return request(app)
                        .get('/api/articles/1/comments')
                        .expect(200)
                        .then(({ body }) => {
                            const { comments } = body
                            comments.forEach((comment) => {
                                expect(comment).not.toEqual(
                                    expect.objectContaining({
                                        comment_id: 1,
                                    })
                                )
                            })
                        })
                })
        })
        it('status:404, should return not found when comment to delete not in db', () => {
            const idToUse = 9000
            return request(app)
                .delete(`/api/comments/${idToUse}`)
                .expect(404)
                .then(({ body }) => {
                    const { msg } = body
                    expect(msg).toEqual(`No comments found with ID: ${idToUse}`)
                })
        })
    })
})
describe('/api', () => {
    describe('GET', () => {
        it('status:200, should return an object containing all available endpoints', () => {
            return request(app)
                .get('/api')
                .expect(200)
                .then(({ body }) => {
                    expect(body).toEqual(
                        expect.objectContaining({
                            'GET /api': {
                                description:
                                    'serves up a json representation of all the available endpoints of the api',
                            },
                            'GET /api/topics': {
                                description: 'serves an array of all topics',
                                queries: [],
                                exampleResponse: {
                                    topics: [
                                        {
                                            slug: 'football',
                                            description: 'Footie!',
                                        },
                                    ],
                                },
                            },
                            'GET /api/articles': {
                                description: 'serves an array of all topics',
                                queries: [
                                    'author',
                                    'topic',
                                    'sort_by',
                                    'order',
                                ],
                                exampleResponse: {
                                    articles: [
                                        {
                                            title: 'Seafood substitutions are increasing',
                                            topic: 'cooking',
                                            author: 'weegembump',
                                            body: 'Text from the article..',
                                            created_at: 1527695953341,
                                        },
                                    ],
                                },
                            },
                        })
                    )
                })
        })
    })
})
