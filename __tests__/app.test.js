const { app } = require('../app')
const seed = require('../db/seeds/seed')
const db = require('../db/connection')
const data = require('../db/data/test-data')
const request = require('supertest')
const { response } = require('express')
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
        test('Responds with a status 200', () => {
            return request(app).get('/api/reviews').expect(200)
        });
        test('Responds with an array', () => {
            return request(app).get('/api/reviews').expect(200).then((response) => {
                expect(Array.isArray(response.body)).toBe(true);
            })
        })
        test('Each array item has the correct properties including comment_count', () => {
            return request(app).get('/api/reviews').expect(200).then((response) => {
                const reviews = response.body
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
                const reviews = response.body
                const comments3 = reviews.find(review => review.comment_count = 3)
                expect(comments3.comment_count).toBe(3)
            });
        });
        test('Response should have a default sort by created_at desc', () => {
            return request(app).get('/api/reviews').expect(200).then((response) => {
                const reviews = response.body
                expect(reviews).toBeSorted({ key: 'created_at', descending: true})
            });
        });
    });
    describe('app error handling', () => {
        test('Responds with an error 404 incorrect endpoints', () => {
            return request(app).get('/api/cats').expect(404).then((response) => {
                expect(response.text).toBe('Not Found :(');
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
                expect(response.text).toBe("review_id not found!")
            });
        });
    });
});