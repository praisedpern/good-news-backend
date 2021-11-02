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
        it('status:200, responds with the correct article object', () => {
            return request(app)
                .get('/api/articles/1')
                .expect(200)
                .then(({ body }) => {
                    const { article } = body
                    expect(article).toEqual({
                        article_id: 1,
                        title: 'Living in the shadow of a great man',
                        body: 'I find this existence challenging',
                        votes: 100,
                        topic: 'mitch',
                        author: 'butter_bridge',
                        created_at: '2020-07-09T20:11:00.000Z',
                        comment_count: 11,
                    })
                })
        })
        it('status:200, responds with second correct article object', () => {
            const idToUse = '2'
            return request(app)
                .get(`/api/articles/2`)
                .expect(200)
                .then(({ body }) => {
                    const { article } = body
                    expect(article).toEqual({
                        article_id: 2,
                        title: 'Sony Vaio; or, The Laptop',
                        body: 'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
                        votes: 0,
                        topic: 'mitch',
                        author: 'icellusedkars',
                        created_at: '2020-10-16T05:03:00.000Z',
                        comment_count: 0,
                    })
                })
        })
        it('status:400, responds with bad request when passed with invalid ID', () => {
            const idToUse = 'notAnId'
            return request(app)
                .get(`/api/articles/${idToUse}`)
                .expect(400)
                .then(({body})=> {
                    const {msg} = body
                    expect(msg).toEqual(`no article found with ID ${idToUse}`)
                })
        })
        
    })
})
