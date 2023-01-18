const { app } = require('../app')
const seed = require('../db/seeds/seed')
const db = require('../db/connection')
const data = require('../db/data/test-data')
const request = require('supertest')
require('jest-sorted')

beforeEach(() => {
    return seed(data);
})

afterAll(() => {
    return db.end();
})

describe('app', () => {
    describe('GET /api/categories', () => {
        test('Responds with a 200 status code', () => {
            return request(app).get('/api/categories').expect(200)
        });
        test('Responds with an array', () => {
            return request(app).get('/api/categories').expect(200).then((response) => {
                expect(Array.isArray(response.body)).toBe(true)
            });
        });
        test('Responds with an array', () => {
            return request(app).get('/api/categories').expect(200).then((response) => {
                const categories = response.body
                categories.forEach((category) => {
                    expect(category).toHaveProperty('slug')
                    expect(category).toHaveProperty('description')
                })
            });
        });
    });
    describe('GET /api/reviews', () => {
        test('Responds with an array', () => {
            return request(app).get('/api/reviews').expect(200).then((response) => {
                expect(Array.isArray(response.body.reviews)).toBe(true);
            })
        })
        test('Each array item has the correct properties including comment_count', () => {
            return request(app).get('/api/reviews').expect(200).then((response) => {
                const reviews = response.body.reviews
                expect(reviews.length).toBe(13)
                reviews.forEach((review) => {
                    expect(review).toHaveProperty('owner')
                    expect(review).toHaveProperty('title')
                    expect(review).toHaveProperty('review_id')
                    expect(review).toHaveProperty('category')
                    expect(review).toHaveProperty('review_img_url')
                    expect(review).toHaveProperty('created_at')
                    expect(review).toHaveProperty('votes')
                    expect(review).toHaveProperty('designer')
                    expect(review).toHaveProperty('comment_count')
                })
            });
        });
        test('Comment_count returns the correct value', () => {
            return request(app).get('/api/reviews').expect(200).then((response) => {
                const reviews = response.body.reviews
                const comments3 = reviews.find(review => review.comment_count = 3)
                expect(comments3.comment_count).toBe(3)
            });
        });
        test('Response should have a default sort by created_at desc', () => {
            return request(app).get('/api/reviews').expect(200).then((response) => {
                const reviews = response.body.reviews
                expect(reviews).toBeSorted({ key: 'created_at', descending: true})
            });
        });
    });
    describe('GET /api/review/:review_id', () => {
        test('Responds with a single review object containing the correct properties', () => {
            return request(app).get('/api/reviews/3').expect(200).then((response) => {
                const review = response.body
                expect.objectContaining({
                    review_id: expect.any(Number),
                    title: expect.any(String),
                    category: expect.any(String),
                    designer: expect.any(String),
                    owner: expect.any(String),
                    review_body: expect.any(String),
                    review_url: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number)
                })
            });
        });
        test('Responds with a 404 error not found when passed an ID that does not currently exist within the db', () => {
            return request(app).get('/api/reviews/9999').expect(404).then((response) => {
                expect(response.text).toBe('id Not Found!')
            });
        });
        test('Responds with a 400 error bad request when passed an ID that is of an incorrect data type', () => {
            return request(app).get('/api/reviews/abc').expect(400).then((response) => {
                expect(response.text).toBe('Bad Request!')
            });
        });
    });
    describe('GET /api/reviews/:review_id/comments', () => {
        test('Responds with an array', () => {
            return request(app).get('/api/reviews/3/comments').expect(200).then(response => {
                const comments = response.body.comments
                expect(Array.isArray(comments)).toBe(true)
            })
        });
        test('Response array contains comment objects with the relevant comment keys', () => {
            return request(app).get('/api/reviews/3/comments').expect(200).then(response => {
                const comments = response.body.comments
                expect(comments.length).toBe(3)
                comments.forEach(comment => {
                    expect(comment).toHaveProperty('comment_id')
                    expect(comment).toHaveProperty('votes')
                    expect(comment).toHaveProperty('created_at')
                    expect(comment).toHaveProperty('author')
                    expect(comment).toHaveProperty('body')
                    expect(comment).toHaveProperty('review_id')
                })
            });
        });
        test('Responds with a 400 error bad request when passed a review_id that is of the wrong data type', () => {
            return request(app).get('/api/reviews/abc/comments').expect(400).then(response => {
                expect(response.text).toBe("Bad Request!")
            });
        });
        test('Responds with a 404 error not found when passed a review_id that is not currently within the db', () => {
            return request(app).get('/api/reviews/9999/comments').expect(404).then(response => {
                expect(response.text).toBe("id Not Found!")
            });
        });
        test('Responds with a status 200 and an empty array when passed a review_id that exists but has no comments associated with it', () => {
            return request(app).get('/api/reviews/1/comments').expect(200).then(response => {
                const comments = response.body.comments
                expect(comments).toEqual([])
            })
        });
        test('Comments are orderd by created_at by default newest comment first', () => {
            return request(app).get('/api/reviews/3/comments').expect(200).then(response => {
                const comments = response.body.comments
                expect(comments).toBeSorted({ key: 'created_at', descending: true})
            })
        });
    });
    describe('POST request to /api/reviews/:review_id/comments', () => {
        test('Responds status 201 and returns the newly created comment', () => {
            return request(app).post('/api/reviews/1/comments')
            .send({ username: 'bainesface', body: "This is a review"})
            .expect(201)
            .then(response => {
                const newComment = response.body.newComment
                expect.objectContaining({
                    review_id: expect.any(Number),
                    comment_id: expect.any(Number),
                    author: expect.any(String),
                    body: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number)
                })
            })
        });
        test('Database - comments table is updated with the new comment', () => {
            return request(app).post('/api/reviews/1/comments')
            .send({ username: 'bainesface', body: "This is a review"})
            .expect(201)
            .then(() => {
                return request(app).get('/api/reviews/1/comments').expect(200).then((response) => {
                    const comments = response.body.comments
                    expect(comments.length).toBe(1)
                })
            })
        });
        test('Responds status 400 - username does not exist', () => {
            return request(app).post('/api/reviews/1/comments')
            .send({ username: 'Stacey123', body: "This is a review too"})
            .expect(400)
            .then(response => {
                expect(response.text).toBe('username does not exist!')
            })
        });
        test('Responds status 400 bad request when passed a review_id that is not the correct data type', () => {
            return request(app).post('/api/reviews/abc/comments')
            .send({ username: 'mallionaire', body: "This is a review three"})
            .expect(400)
            .then(response => {
                expect(response.text).toBe('Bad Request!')
            })
        });
        test('Responds status 400 bad request when passed a request body that is empty', () => {
            return request(app).post('/api/reviews/abc/comments')
            .send({})
            .expect(400)
            .then(response => {
                expect(response.text).toBe('Bad Request!')
            })
        });
        test('Responds status 400 bad request when passed a request body that has the invalid fields', () => {
            return request(app).post('/api/reviews/1/comments')
            .send({votes: 20})
            .expect(400)
            .then(response => {
                expect(response.text).toBe('Bad Request!')
            })
        });
        test('Responds status 404 not found when passed a review_id that is not currently in the data', () => {
            return request(app).post('/api/reviews/9999/comments')
            .send({ username: 'mallionaire', body: "This is a review four"})
            .expect(404)
            .then(response => {
                expect(response.text).toBe('id Not Found!')
            })
        });
    });
    describe('app error handling', () => {
        test('Responds with an error 404 incorrect endpoints', () => {
            return request(app).get('/api/cats').expect(404).then((response) => {
                expect(response.text).toBe('Not Found :(');
            });
        });
    });
});